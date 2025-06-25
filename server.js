const express = require("express");
const cors = require("cors");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

const SPREADSHEET_ID = "1x0mnqlP8ZSFVCofi29m2oQDW0AlwDlZ6p89_idwR0H4";

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

async function accessSpreadsheet() {
  const creds = JSON.parse(process.env.GOOGLE_CREDS);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
}

app.post("/checkin", async (req, res) => {
  try {
    console.log("Recebido:", req.body);
    const sheet = await accessSpreadsheet();
    const { id, nome, evento } = req.body;
    const dataHora = new Date().toISOString();
    await sheet.addRow({ id, nome, evento, dataHora });
    console.log("Linha adicionada com sucesso");
    res.status(200).json({ status: "ok", message: "Check-in registrado" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
