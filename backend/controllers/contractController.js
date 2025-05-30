const db = require('../config/db');

// Lấy tất cả hợp đồng
exports.getAllContracts = async (req, res) => {
    try {
        const [contracts] = await db.execute(`
            SELECT 
                r.rental_id,
                r.start_date,
                r.end_date,
                r.total_price,
                r.payment_status,
                r.status,
                CONCAT(c.first_name, ' ', c.last_name) as fullName,
                car.brand,
                car.model,
                car.license_plate
            FROM rental r
            JOIN customers c ON r.customer_id = c.customer_id
            JOIN car ON r.car_id = car.car_id
            ORDER BY r.created_at DESC
        `);

        res.json(contracts);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Lấy chi tiết hợp đồng
exports.getContractDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const [contract] = await db.execute(`
            SELECT 
                r.*,
                CONCAT(c.first_name, ' ', c.last_name) as fullName,
                c.phone_number,
                c.email,
                car.brand,
                car.model,
                car.license_plate,
                car.color
            FROM rental r
            JOIN customers c ON r.customer_id = c.customer_id
            JOIN car ON r.car_id = car.car_id
            WHERE r.rental_id = ?
        `, [id]);

        if (contract.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

        const [addons] = await db.execute(`
            SELECT * FROM rental_addons 
            WHERE rental_id = ?
        `, [id]);

        res.json({
            ...contract[0],
            addons
        });

    } catch (error) {
        console.error('Lỗi khi lấy chi tiết hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cập nhật hợp đồng
exports.updateContract = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            start_date,
            end_date,
            total_price,
            payment_status,
            status,
            actual_return_date
        } = req.body;
        console.log('status:', status);
            console.log('return_date:', return_date);
        console.log('staff_id:', staff_id);
        console.log('rental_id:', rental_id);

        await db.beginTransaction();

        const [existingContract] = await db.execute(
            'SELECT * FROM rental WHERE rental_id = ?',
            [id]
        );

        if (existingContract.length === 0) {
            await db.rollback();
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }
        await db.execute(`
            UPDATE rental 
            SET 
                start_date = ?,
                end_date = ?,
                total_price = ?,
                payment_status = ?,
                status = ?,
                actual_return_date = ?,
                updated_at = NOW()
            WHERE rental_id = ?
        `, [
            start_date,
            end_date,
            total_price,
            payment_status,
            status,
            actual_return_date,
            id
        ]);

        
        if (status === 'Hoàn thành' || status === 'Hủy') {
            await db.execute(
                'UPDATE car SET status = ? WHERE car_id = ?',
                ['available', existingContract[0].car_id]
            );
        } else if (status === 'Đang thuê') {
            await db.execute(
                'UPDATE car SET status = ? WHERE car_id = ?',
                ['unavailable', existingContract[0].car_id]
            );
        }

        await db.commit();
        res.json({ message: 'Cập nhật hợp đồng thành công' });

    } catch (error) {
        await db.rollback();
        console.error('Lỗi khi cập nhật hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Xóa hợp đồng
exports.deleteContract = async (req, res) => {
    try {
        const { id } = req.params;

        await db.beginTransaction();


        const [contract] = await db.execute(
            'SELECT * FROM rental WHERE rental_id = ?',
            [id]
        );

        if (contract.length === 0) {
            await db.rollback();
            return res.status(404).json({ message: 'Không tìm thấy hợp đồng' });
        }

      
        await db.execute('DELETE FROM rental_addons WHERE rental_id = ?', [id]);

      
        await db.execute('DELETE FROM rental WHERE rental_id = ?', [id]);


        await db.execute(
            'UPDATE car SET status = "available" WHERE car_id = ?',
            [contract[0].car_id]
        );

        await db.commit();
        res.json({ message: 'Xóa hợp đồng thành công' });

    } catch (error) {
        await db.rollback();
        console.error('Lỗi khi xóa hợp đồng:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};
