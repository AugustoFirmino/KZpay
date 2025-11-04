import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function Atividades() {
  const router = useRouter();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 7;
  const [reciboAtivo, setReciboAtivo] = useState(null);

  // 🔹 Dados de exemplo
  const historico = [
    {
      id: 1,
      tipo: "Levantamento",
      valor: 6000,
      valorStr: "6.000 KZ",
      data: "2025-10-25 10:20",
      kzpayCode: "KZPAY-103993",
      local: "Agência Principal - Luanda",
      nome: "João Manuel",
      nbt: "7000 5555 3333",
      createdAt: "2025-10-25T10:20:00Z",
    },
  
     {
      id: 2,
      tipo: "Pagamento",
      valor: 15000,
      valorStr: "15.000 KZ",
      data: "2025-10-20 15:30",
      kzpayCode: "KZPAY-104883",
      local: "KZPay Online",
      nome: "Maria Lopes",
      nbt: "7000 8888 2222",
      createdAt: "2025-10-20T15:30:00Z",
    },
     {
      id: 3,
      tipo: "Pagamento",
      valor: 15000,
      valorStr: "15.000 KZ",
      data: "2025-10-20 15:30",
      kzpayCode: "KZPAY-104883",
      local: "KZPay Online",
      nome: "Maria Lopes",
      nbt: "7000 8888 2222",
      createdAt: "2025-10-20T15:30:00Z",
    },
     {
      id: 4,
      tipo: "Pagamento",
      valor: 15000,
      valorStr: "15.000 KZ",
      data: "2025-10-20 15:30",
      kzpayCode: "KZPAY-104883",
      local: "KZPay Online",
      nome: "Maria Lopes",
      nbt: "7000 8888 2222",
      createdAt: "2025-10-20T15:30:00Z",
    },
     {
      id: 5,
      tipo: "Pagamento",
      valor: 15000,
      valorStr: "15.000 KZ",
      data: "2025-10-20 15:30",
      kzpayCode: "KZPAY-104883",
      local: "KZPay Online",
      nome: "Maria Lopes",
      nbt: "7000 8888 2222",
      createdAt: "2025-10-20T15:30:00Z",
    },
     {
      id: 6,
      tipo: "Pagamento",
      valor: 15000,
      valorStr: "15.000 KZ",
      data: "2025-10-20 15:30",
      kzpayCode: "KZPAY-104883",
      local: "KZPay Online",
      nome: "Maria Lopes",
      nbt: "7000 8888 2222",
      createdAt: "2025-10-20T15:30:00Z",
    },
     {
      id: 7,
      tipo: "Pagamento",
      valor: 15000,
      valorStr: "15.000 KZ",
      data: "2025-10-20 15:30",
      kzpayCode: "KZPAY-104883",
      local: "KZPay Online",
      nome: "Maria Lopes",
      nbt: "7000 8888 2222",
      createdAt: "2025-10-20T15:30:00Z",
    },
     {
      id: 8,
      tipo: "Pagamento",
      valor: 15000,
      valorStr: "15.000 KZ",
      data: "2025-10-20 15:30",
      kzpayCode: "KZPAY-104883",
      local: "KZPay Online",
      nome: "Maria Lopes",
      nbt: "7000 8888 2222",
      createdAt: "2025-10-20T15:30:00Z",
    },
     {
      id: 9,
      tipo: "Pagamento",
      valor: 15000,
      valorStr: "15.000 KZ",
      data: "2025-10-20 15:30",
      kzpayCode: "KZPAY-104883",
      local: "KZPay Online",
      nome: "Maria Lopes",
      nbt: "7000 8888 2222",
      createdAt: "2025-10-20T15:30:00Z",
    },
     {
      id:10 ,
      tipo: "Pagamento",
      valor: 15000,
      valorStr: "15.000 KZ",
      data: "2025-10-20 15:30",
      kzpayCode: "KZPAY-104883",
      local: "Agência Central - Luanda",
      nome: "Maria Lopes",
      nbt: "7000 8888 2222",
      createdAt: "2025-10-20T15:30:00Z",
    },
    
  ];

  const totalPaginas = Math.ceil(historico.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const historicoPaginado = historico.slice(inicio, fim);

  const formatCurrency = (v) =>
    new Intl.NumberFormat("pt-PT").format(Number(v) || 0) + " KZ";

  // 🔹 Gerar PDF com QR

const gerarReciboPDF = async (item) => {
  try {
    // Certifica-te que o item contém: id, kzpayCode, valorStr, createdAt, nome, nbt, local (opcional)
    const localTxt = item.local || "Agência Principal - Luanda";
    const nomeCliente = item.nome || "Cliente KZPay";
    const nbt = item.nbt || "0000 0000 0000";

    // Geração do QR (PNG) com dados essenciais
    const qrData = `KZPAY:${item.kzpayCode}|VALOR:${item.valor}|ID:${item.id}|NBT:${nbt}|CLIENTE:${nomeCliente}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
      qrData
    )}&format=png`;

    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <style>
            @media print { @page { margin: 0; } }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; 
              margin: 0; 
              background: #f2f6fb; 
              color: #152238; 
            }
            .wrap { width: 90%; max-width: 720px; margin: 28px auto; }
            .card {
              background: #ffffff;
              border-radius: 14px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(11,18,40,0.06);
              border: 1px solid rgba(71,63,180,0.06);
            }

            .header {
              background: linear-gradient(135deg,#4C44C1 0%, #8F80FF 100%);
              color: #fff;
              padding: 20px 24px;
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .logo {
              width: 64px;
              height: 64px;
              border-radius: 10px;
              background: rgba(255,255,255,0.12);
              display:flex; align-items:center; justify-content:center;
            }
            .logo img { width: 40px; height: 40px; object-fit:contain; }
            .brand { font-weight:700; font-size:18px; margin:0; }
            .brand-sub { margin:0; opacity:0.92; font-size:12px; }

            .body { padding: 22px 24px; display: flex; gap: 18px; }
            .left { flex: 1; }
            .right { width: 260px; display:flex; flex-direction:column; align-items:center; justify-content:flex-start; gap:12px; }

            .amountBox {
              background: linear-gradient(180deg,#fff 0%, #fbfcff 100%);
              border: 1px solid #eef1fb;
              padding: 18px;
              border-radius: 10px;
              text-align: left;
            }
            .amountLabel { font-size:12px; color:#6c6f86; margin-bottom:6px; font-weight:600; }
            .amountValue { font-size:28px; font-weight:800; color:#111827; margin:0; }

            .status {
              margin-top:10px;
              display:inline-block;
              padding:8px 12px;
              border-radius: 8px;
              background: #f5f7ff;
              color: #4C44C1;
              font-weight:700;
              font-size:13px;
            }

            .infoGrid { display:flex; flex-direction:column; gap:8px; margin-top:16px; }
            .infoRow { display:flex; justify-content:space-between; align-items:center; gap:8px; }
            .label { color:#6b6f86; font-size:13px; font-weight:600; }
            .value { color:#0f1724; font-size:14px; }

            .qrCard {
              background: #fff;
              padding: 12px;
              border-radius: 12px;
              border: 1px solid #eef1fb;
              display:flex;
              align-items:center;
              justify-content:center;
              flex-direction:column;
            }
            .qrCard img { width: 200px; height:200px; object-fit:contain; border-radius:10px; }

            .footer {
              padding: 16px 22px;
              background: #fbfcff;
              border-top: 1px solid #f0f3ff;
              display:flex;
              justify-content:space-between;
              align-items:center;
            }
            .footer .left { font-size:12px; color:#64748b; }
            .footer .right { font-size:12px; color:#64748b; text-align:right; }

            .signature {
              margin-top:16px;
              display:flex;
              justify-content:space-between;
              gap:12px;
            }
            .sigBox { flex:1; padding:10px; border-radius:8px; border:1px dashed #e6ecff; text-align:center; color:#7b7f95; font-size:13px; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="card">
              <div class="header">
                <div class="logo">
                  <img src="https://cdn-icons-png.flaticon.com/512/6269/6269947.png" alt="KZPay" />
                </div>
                <div style="flex:1;">
                  <div class="brand">KZPay</div>
                  <div class="brand-sub">Comprovativo de Levantamento</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:12px;opacity:0.92">Data</div>
                  <div style="font-weight:700">${new Date(item.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div class="body">
                <div class="left">
                  <div class="amountBox">
                    <div class="amountLabel">Valor levantado</div>
                    <div class="amountValue">${item.valorStr}</div>
                    <div class="status">Levantamento Efectuado</div>

                    <div class="infoGrid">
                      <div class="infoRow"><div class="label">Nome do Cliente</div><div class="value">${nomeCliente}</div></div>
                      <div class="infoRow"><div class="label">NBT / Nº Conta</div><div class="value">${nbt}</div></div>
                      <div class="infoRow"><div class="label">Código KZPay</div><div class="value">${item.kzpayCode}</div></div>
                      <div class="infoRow"><div class="label">ID Transacção</div><div class="value">${item.id}</div></div>
                      <div class="infoRow"><div class="label">Local</div><div class="value">${localTxt}</div></div>
                    </div>

                    <div class="signature">
                      <div class="sigBox">Assinatura do Cliente</div>
                      <div class="sigBox">Assinatura do Caixa</div>
                    </div>
                  </div>
                </div>

                <div class="right">
                  <div style="font-weight:700;color:#152238;">Código QR</div>
                  <div class="qrCard">
                    <img src="${qrUrl}" alt="QR Code" />
                    <div style="margin-top:8px;font-size:12px;color:#6b6f86;">Apresente no balcão para validação</div>
                  </div>

                  <div style="margin-top:10px;font-size:12px;color:#8a95b8;text-align:center;">
                    Recibo gerado por KZPay
                  </div>
                </div>
              </div>

              <div class="footer">
                <div class="left">Documento emitido automaticamente — KZPay</div>
                <div class="right">Guarde este comprovativo como prova de levantamento</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Partilhar Recibo de Levantamento",
    });
  } catch (e) {
    console.error("gerarReciboPDF error:", e);
    Alert.alert("Erro", "Não foi possível gerar o recibo.");
  }
};

  const abrirRecibo = (item) => setReciboAtivo(item);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#8F80FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Atividades</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {historicoPaginado.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => abrirRecibo(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.tipo}>{item.tipo}</Text>
              <Text style={styles.data}>{item.data}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.valor}>{formatCurrency(item.valor)}</Text>
              <Text style={styles.codigo}>{item.kzpayCode}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Paginação */}
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageBtn, paginaAtual === 1 && { opacity: 0.5 }]}
            disabled={paginaAtual === 1}
            onPress={() => setPaginaAtual((p) => Math.max(1, p - 1))}
          >
            <Ionicons name="arrow-back-circle" size={28} color="#8F80FF" />
          </TouchableOpacity>

          <Text style={styles.pageIndicator}>
            {paginaAtual} / {totalPaginas}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageBtn,
              paginaAtual === totalPaginas && { opacity: 0.5 },
            ]}
            disabled={paginaAtual === totalPaginas}
            onPress={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
          >
            <Ionicons name="arrow-forward-circle" size={28} color="#8F80FF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

    {/* Modal com Recibo visível */}
<Modal visible={!!reciboAtivo} animationType="slide" transparent>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {reciboAtivo && (
        <>
          <Text style={styles.modalTitle}>
            Recibo de {reciboAtivo.tipo}
          </Text>

          {/* QR e layout de recibo */}
          <View style={styles.reciboContainer}>
            {/* Coluna Esquerda */}
            <View style={styles.colunaEsquerda}>
              <Text style={styles.modalLabel}>Cliente:</Text>
              <Text style={styles.modalInfo}>{reciboAtivo.nome}</Text>

              <Text style={styles.modalLabel}>NBT:</Text>
              <Text style={styles.modalInfo}>{reciboAtivo.nbt}</Text>

              <Text style={styles.modalLabel}>Local:</Text>
              <Text style={styles.modalInfo}>{reciboAtivo.local}</Text>
            </View>

            {/* Linha divisória */}
            <View style={styles.divisorVertical} />

            {/* Coluna Direita */}
            <View style={styles.colunaDireita}>
            

 <Text style={styles.modalLabel}>Montante:</Text>
              <Text style={styles.modalValue}>{formatCurrency(reciboAtivo.valor)}</Text>

              <Text style={styles.modalLabel}>Data:</Text>
              <Text style={styles.modalInfo}>{reciboAtivo.data}</Text>

    <View style={styles.qrArea}>
                <QRCode
                  value={`KZPAY:${reciboAtivo.kzpayCode}|VALOR:${reciboAtivo.valor}|NBT:${reciboAtivo.nbt}`}
                  size={90}
                />
              </View>
              <Text style={styles.modalLabel}>Código KZPay:</Text>
              <Text style={styles.modalInfo}>{reciboAtivo.kzpayCode}</Text>
               
           
            </View>
          </View>

          {/* Botões */}
          <TouchableOpacity
            onPress={() => gerarReciboPDF(reciboAtivo)}
            style={[styles.modalBtn, { backgroundColor: "#4C44C1" }]}
          >
            <Ionicons name="document-text-outline" size={18} color="#fff" />
            <Text style={styles.modalBtnText}>Gerar PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setReciboAtivo(null)}
            style={[styles.modalBtn, { backgroundColor: "#1F1C2C" }]}
          >
            <Ionicons name="arrow-undo-outline" size={18} color="#fff" />
            <Text style={styles.modalBtnText}>Fechar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
</Modal>

    </SafeAreaView>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 10,
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#07213a",
  },
  backBtn: { backgroundColor: "#fff", padding: 8, borderRadius: 10 },
  headerTitle: { color: "#8F80FF", fontSize: 18, fontWeight: "700" },
  scroll: { paddingTop: 120, paddingHorizontal: 18, paddingBottom: 40 },
  card: {
    backgroundColor: "#363636ff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tipo: { color: "#fff", fontSize: 16, fontWeight: "600" },
  data: { color: "#8F80FF", fontSize: 12, marginTop: 3 },
  valor: { color: "#fff", fontWeight: "700", fontSize: 15 },
  codigo: { color: "#8F80FF", fontSize: 12 },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    gap: 20,
  },
  pageIndicator: { color: "#8F80FF", fontWeight: "700", fontSize: 16 },
  pageBtn: { padding: 4 },

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
},
modalContent: {
  backgroundColor: "#031D34",
  borderRadius: 20,
  padding: 22,
  width: "92%",
  alignItems: "center",
},
modalTitle: {
  color: "#8F80FF",
  fontSize: 18,
  fontWeight: "700",
  marginBottom: 16,
  textAlign: "center",
},
reciboContainer: {
  flexDirection: "row",
  backgroundColor: "#041E36",
  borderRadius: 14,
  padding: 16,
  width: "100%",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 20,
},
colunaEsquerda: {
  flex: 1,
  paddingRight: 10,
},
colunaDireita: {
  flex: 1,
  alignItems: "center",
  paddingLeft: 10,
},
divisorVertical: {
  width: 1,
  backgroundColor: "#133B5C",
  marginHorizontal: 6,
},
modalLabel: {
  color: "#8F80FF",
  fontSize: 13,
  fontWeight: "600",
  marginTop: 6,
},
modalValue: {
  color: "#052742",
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 6,
},
modalInfo: {
  color: "#fff",
  fontSize: 13,
  marginBottom: 4,
},
qrArea: {
  backgroundColor: "#052742",
  borderRadius: 10,
  padding: 8,
  marginBottom: 8,
},
modalBtn: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 16,
  width: "100%",
  marginTop: 10,
},
modalBtnText: { color: "#fff", marginLeft: 6, fontWeight: "600" },

  });
