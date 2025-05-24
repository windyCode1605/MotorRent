const { url } = require('inspector');
const db = require('../config/promiseDb');
const { buffer } = require('stream/consumers');
const axios = require('axios');

exports.createMoMoPayment = async (req, res) => {

  var { reservation_id } = req.body;
  if (!reservation_id) return res.status(400).json({ message: "Thiếu reservation_id " });

  console.log("reservations_id ", reservation_id);
  try {
    var [rows] = await db.execute(
      'SELECT total_price FROM reservations WHERE reservation_id = ?',
      [reservation_id]
    );

    console.log("PRICE : ", Number(rows[0].total_price).toFixed(0));
    if (rows.length === 0) return res.status(404).json({ message: "Không tìm thấy đơn đặt hàng ?" });

    var total_price = Number(rows[0].total_price).toFixed(0);

    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';
    var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    var requestType = "payWithMethod";
    var amount = total_price;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: orderGroupId,
      signature: signature
    });

    const options = {
      method: "POST",
      url: "https://test-payment.momo.vn/v2/gateway/api/create",
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      },
      data: requestBody
    }
    let result;

    result = await axios(options);
   
    await db.execute(
      'INSERT INTO payments (reservation_id, order_id, amount, status, payment_method, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [reservation_id, orderId, amount, 'pending', 'momo']
    );
    console.log('MOMO RESPONE : ', result.data);
    return res.status(200).json(result.data);
  }


  catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "server error"
    })
  }
}




///////////////////
exports.handleMomoIPN = async (req, res) => {
  try {
    const {
      orderId,
      resultCode,
      message,
      amount,
      extraData,
      requestId
    } = req.body;

    console.log("Nhận IPN từ MoMo:", req.body);

    // Kiểm tra trạng thái thanh toán thành công
    if (resultCode === 0) {
      // Cập nhật đơn hàng trong DB
      await db.execute(
        "UPDATE payments SET status = ?, updated_at = NOW() WHERE order_id = ?",
        ['success', orderId]
      );
    } else {
      await db.execute(
        "UPDATE payments SET status = ?, updated_at = NOW() WHERE order_id = ?",
        ['failed', orderId]
      );
    }

    return res.status(200).json({ message: "IPN received" });
  } catch (err) {
    console.error("Lỗi xử lý IPN:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
}
