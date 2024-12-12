require('dotenv').config(); // Carga las variables de entorno
const express = require('express');
const cors = require('cors'); // Importa cors
const nodeMailer = require('nodemailer');

// Inicia la aplicación de Express
const app = express();

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors()); // Aplica CORS para todas las rutas

app.use(cors({ origin: 'https://a-time-for-lunch-vdfv.onrender.com' }));

// Middleware para parsear JSON
app.use(express.json());

// Configuración del transporter
const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Ruta para enviar correos
app.post('/send-email', (req, res) => {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
        return res.status(400).send({ success: false, message: "Faltan campos obligatorios." });
    }

    const mail = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    };

    transporter.sendMail(mail, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send({ success: false, message: "Error al enviar el correo." });
        }
        res.send({ success: true, message: "Correo enviado con éxito.", info });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
