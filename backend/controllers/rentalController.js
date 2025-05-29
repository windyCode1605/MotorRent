const db = require('../config/db');
const { sendReminderEmail } = require('../utils/emailService');

// Lấy danh sách đơn thuê xe của khách hàng
exports.getCustomerRentals = async (req, res) => {
    try {
        const { account_id } = req.user;

        const [customers] = await db.execute(
            'SELECT customer_id FROM customers WHERE account_id = ?',
            [account_id]
        );

        if (customers.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin khách hàng' });
        }

        const customer_id = customers[0].customer_id;

        const [rentals] = await db.execute(`
            SELECT 
                r.*, 
                c.brand, c.model, c.license_plate
            FROM rental r
            JOIN car c ON r.car_id = c.car_id
            WHERE r.customer_id = ?
            ORDER BY r.created_at DESC
        `, [customer_id]);

        res.json(rentals);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn thuê:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Hủy đơn thuê xe
exports.cancelRental = async (req, res) => {
    try {
        const { rental_id } = req.params;
        const { account_id } = req.user;

        const [rentals] = await db.execute(`
            SELECT r.* 
            FROM rental r
            JOIN customers c ON r.customer_id = c.customer_id
            WHERE r.rental_id = ? AND c.account_id = ?
        `, [rental_id, account_id]);

        if (rentals.length === 0) {
            return res.status(403).json({ message: 'Không có quyền hủy đơn này' });
        }

        const rental = rentals[0];

        if (rental.status !== 'Chờ xác nhận') {
            return res.status(400).json({ 
                message: 'Chỉ có thể hủy đơn hàng đang chờ xác nhận' 
            });
        }

        await db.execute(
            'UPDATE rental SET status = ?, updated_at = NOW() WHERE rental_id = ?',
            ['Từ chối', rental_id]
        );

        await db.execute(
            'UPDATE car SET status = "available" WHERE car_id = ?',
            [rental.car_id]
        );

        res.json({ message: 'Đã hủy đơn hàng thành công', rental_id });
    } catch (error) {
        console.error('Lỗi khi hủy đơn thuê:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy chi tiết đơn thuê xe
exports.getRentalDetails = async (req, res) => {
    try {
        const { rental_id } = req.params;
        const { account_id } = req.user;

        const [rentals] = await db.execute(`
            SELECT 
                r.*, 
                c.brand, c.model, c.license_plate, c.color, c.image_url,
                cu.first_name, cu.last_name, cu.phone_number
            FROM rental r
            JOIN car c ON r.car_id = c.car_id
            JOIN customers cu ON r.customer_id = cu.customer_id
            WHERE r.rental_id = ? AND cu.account_id = ?
        `, [rental_id, account_id]);

        if (rentals.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin đơn hàng' });
        }

        const [addons] = await db.execute(
            'SELECT * FROM rental_addons WHERE rental_id = ?',
            [rental_id]
        );

        res.json({ ...rentals[0], addons });
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn thuê:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cập nhật trạng thái đơn thuê
exports.updateRentalStatus = async (req, res) => {
    try {
        const { rental_id } = req.params;
        const { status } = req.body;
        const { role } = req.user;

        if (!['admin', 'staff'].includes(role.toLowerCase())) {
            return res.status(403).json({ message: 'Không có quyền thực hiện thao tác này' });
        }

        const allowedStatuses = [
            'Chờ xác nhận', 'Đã xác nhận', 'Đã nhận xe', 'Đã trả xe',
            'Xe tai nạn', 'Xe sự cố', 'Từ chối'
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        await db.execute(
            'UPDATE rental SET status = ?, updated_at = NOW() WHERE rental_id = ?',
            [status, rental_id]
        );

        if (status === 'Đã xác nhận') {
            const [rentalInfo] = await db.execute(`
                SELECT r.*, c.*, cu.email, cu.first_name, cu.last_name
                FROM rental r
                JOIN car c ON r.car_id = c.car_id
                JOIN customers cu ON r.customer_id = cu.customer_id
                WHERE r.rental_id = ?
            `, [rental_id]);

            if (rentalInfo.length > 0) {
                const rental = rentalInfo[0];
                await sendReminderEmail(
                    rental.email,
                    `${rental.first_name} ${rental.last_name}`,
                    rental
                );
            }
        }

        res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đơn thuê:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
