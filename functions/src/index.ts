import { onCreate } from "firebase-functions/v2/firestore";
import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import * as functions from 'firebase-functions';

admin.initializeApp();

// Configuração do nodemailer com um serviço de e-mail (exemplo: Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user, // Variável de ambiente do Firebase Functions
    pass: functions.config().email.pass, // Senha de aplicativo (criada nas configurações do Google)
  }
});

exports.enviarLembreteConsulta = onCreate('consultas/{consultaId}', async (snap, context) => {
  const consulta = snap.data();
  if (!consulta) {
    console.log('Dados da consulta não encontrados.');
    return null;
  }

  const { userId, titulo, medico, dataHora, localizacao, observacoes } = consulta;

  // Obter o e-mail do usuário
  const userSnapshot = await admin.firestore().collection('cadastro').doc(userId).get();
  const userEmail = userSnapshot.data()?.email;

  if (!userEmail) {
    console.log(`E-mail não encontrado para o usuário ${userId}`);
    return null;
  }

  // Configurar o conteúdo do e-mail
  const mailOptions = {
    from: functions.config().email.user, // Remetente
    to: userEmail, // Destinatário
    subject: `Lembrete de Consulta: ${titulo}`,
    text: `
      Lembrete da sua consulta:
      - Médico: ${medico}
      - Data e Hora: ${new Date(dataHora).toLocaleString()} (hora local)
      - Localização: ${localizacao}
      - Observações: ${observacoes}
    `,
  };

  // Enviar o e-mail
  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
  }

  return null;
});
