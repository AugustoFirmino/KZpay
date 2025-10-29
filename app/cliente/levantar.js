import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  Alert,
  Clipboard,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function Levantamento() {
  const router = useRouter();
  const [saldo, setSaldo] = useState(245000);
  const [valor, setValor] = useState("");
  const [pin, setPin] = useState("");
  const [history, setHistory] = useState([]);
  const [qrVisible, setQrVisible] = useState(false);
  const [activeQrItem, setActiveQrItem] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const valoresRapidos = [1000, 2000, 3000, 4000, 5000, 10000];

  const handleLevantamento = () => {
    if (!valor || !pin) {
      Alert.alert("Erro", "Por favor, preencha todos os campos!");
      return;
    }

    const valorNum = Number(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      Alert.alert("Erro", "Valor inválido!");
      return;
    }

    if (valorNum > saldo) {
      Alert.alert("Saldo insuficiente", "Não tens saldo suficiente para este levantamento.");
      return;
    }

    if (pin.length !== 4) {
      Alert.alert("Erro", "O PIN deve ter 4 dígitos.");
      return;
    }

    const kzpayCode = `KZPAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `${Date.now()}`;
    const expiresAt = Date.now() + 10 * 60 * 1000;

    const newItem = {
      id,
      valor: valorNum,
      valorStr: formatCurrency(valorNum),
      kzpayCode,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt,
    };

    setHistory((h) => [newItem, ...h]);
    //setSaldo((s) => s - valorNum);
    setActiveQrItem(newItem);
    setQrVisible(true);
    setTimeLeft(600);

    setValor("");
    setPin("");
  };

  // Temporizador QR (10 min)
  useEffect(() => {
    if (!qrVisible || !activeQrItem) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          expireQr();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qrVisible, activeQrItem]);

  const expireQr = () => {
    setHistory((h) =>
      h.map((it) =>
        it.id === activeQrItem?.id && it.status === "pending"
          ? { ...it, status: "cancelled" }
          : it
      )
    );
    setActiveQrItem((prev) =>
      prev && prev.status === "pending" ? { ...prev, status: "cancelled" } : prev
    );
    Alert.alert("Expirado", "O QR Code expirou após 10 minutos.");
  };

  const gerarReciboPDF = async (item) => {
    try {
      const localTxt = item.local || "Agência Principal - Luanda";
      const nomeCliente = item.nome || "Cliente KZPay";
      const nbt = item.nbt || "0000 0000 0000";

      const qrData = `KZPAY:${item.kzpayCode}|VALOR:${item.valor}|ID:${item.id}|NBT:${nbt}|CLIENTE:${nomeCliente}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
        qrData
      )}&format=png`;

      const html = `
        <!doctype html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { font-family: Arial; color: #152238; background: #f2f6fb; }
            .wrap { width: 90%; max-width: 720px; margin: 28px auto; }
            .card { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(11,18,40,0.06); }
            .header { background: linear-gradient(135deg,#4C44C1,#8F80FF); color: #fff; padding: 20px; }
            .body { padding: 22px; display:flex; gap:18px; }
            .amountValue { font-size:28px; font-weight:800; color:#111; margin:0; }
            .status { margin-top:10px; display:inline-block; padding:8px 12px; border-radius:8px; background:#f5f7ff; color:#4C44C1; font-weight:700; font-size:13px; }
            .infoRow { display:flex; justify-content:space-between; font-size:13px; margin-top:6px; }
            .qrCard img { width:200px; height:200px; border-radius:10px; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="card">
              <div class="header">
                <h2>KZPay - Comprovativo de Levantamento</h2>
                <p>${new Date(item.createdAt).toLocaleString()}</p>
              </div>
              <div class="body">
                <div style="flex:1;">
                  <div class="amountValue">${item.valorStr}</div>
                  <div class="status">Levantamento Efectuado</div>
                  <div class="infoRow"><b>Cliente:</b> ${nomeCliente}</div>
                  <div class="infoRow"><b>NBT:</b> ${nbt}</div>
                  <div class="infoRow"><b>Código:</b> ${item.kzpayCode}</div>
                  <div class="infoRow"><b>ID:</b> ${item.id}</div>
                  <div class="infoRow"><b>Local:</b> ${localTxt}</div>
                </div>
                <div class="qrCard">
                  <img src="${qrUrl}" alt="QR" />
                </div>
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

  const cancelLevantamento = (itemId) => {
    Alert.alert("Cancelar Levantamento", "Deseja cancelar este levantamento?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim, cancelar",
        style: "destructive",
        onPress: () => {
          setHistory((h) =>
            h.map((it) => {
              if (it.id === itemId && it.status === "pending") {
                setSaldo((s) => s + it.valor);
                return { ...it, status: "cancelled" };
              }
              return it;
            })
          );
          if (activeQrItem?.id === itemId)
            setActiveQrItem((p) => (p ? { ...p, status: "cancelled" } : p));
        },
      },
    ]);
  };

  const openQrModalForItem = (item) => {
    setActiveQrItem(item);
    setQrVisible(true);
    setTimeLeft(
      item.expiresAt ? Math.max(0, Math.floor((item.expiresAt - Date.now()) / 1000)) : 0
    );
  };

  const copyKzpayToClipboard = (code) => {
    try {
      Clipboard.setString(code);
      Alert.alert("Copiado", "Código KZPay copiado para a área de transferência.");
    } catch {
      Alert.alert("Erro", "Não foi possível copiar o código.");
    }
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("pt-PT").format(Number(v) || 0) + " KZ";

  const formatTimer = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.fixedHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#8F80FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Levantamento</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Saldo */}
          <LinearGradient colors={["#8F80FF", "#4C44C1", "#1F1C2C"]} style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Saldo Disponível</Text>
            <Text style={styles.balanceValue}>{formatCurrency(saldo)}</Text>
            <Text style={styles.balanceSub}>Atualizado agora</Text>
          </LinearGradient>

          {/* Valor a levantar */}
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#8F80FF" />
            <TextInput
              style={styles.input}
              placeholder="Valor a levantar (KZ)"
              placeholderTextColor="#cfcfcf"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />
          </View>

          {/* Botões de valores rápidos */}
          <View style={styles.radioRow}>
            {valoresRapidos.map((v) => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.radioButton,
                  Number(valor) === v && styles.radioButtonActive,
                ]}
                onPress={() => setValor(v.toString())}
              >
                <Text
                  style={[
                    styles.radioText,
                    Number(valor) === v && { color: "#8F80FF", fontWeight: "700" },
                  ]}
                >
                  {formatCurrency(v)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* PIN */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#8F80FF" />
            <TextInput
              style={styles.input}
              placeholder="PIN de segurança (4 dígitos)"
              placeholderTextColor="#cfcfcf"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              value={pin}
              onChangeText={setPin}
            />
          </View>

          {/* Botão confirmar */}
          <TouchableOpacity style={styles.button} onPress={handleLevantamento}>
            <LinearGradient colors={["#8F80FF", "#4C44C1"]} style={styles.buttonGradient}>
              <Ionicons name="wallet-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Confirmar Levantamento</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Histórico */}
          <View style={{ marginTop: 30 }}>
            <Text style={styles.historyTitle}>Histórico de Levantamentos</Text>
            {history.length === 0 && (
              <Text style={styles.emptyText}>Nenhum levantamento ainda.</Text>
            )}

            {history.map((h) => (
              <View key={h.id} style={styles.historyCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyText}>{h.valorStr}</Text>
                  <Text style={styles.historySub}>
                    {new Date(h.createdAt).toLocaleString()}
                  </Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.statusText,
                      h.status === "pending"
                        ? { color: "#FFD700" }
                        : h.status === "confirmed"
                        ? { color: "#00D26A" }
                        : { color: "#FF5C63" },
                    ]}
                  >
                    {h.status === "pending"
                      ? "Pendente"
                      : h.status === "confirmed"
                      ? "Confirmado"
                      : "Cancelado"}
                  </Text>

                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <TouchableOpacity
                      onPress={() => openQrModalForItem(h)}
                      style={styles.smallButton}
                    >
                      <Ionicons name="qr-code-outline" size={18} color="#fff" />
                    </TouchableOpacity>

                    {h.status === "confirmed" && (
                      <TouchableOpacity
                        onPress={() => gerarReciboPDF(h)}
                        style={[
                          styles.smallButton,
                          { marginLeft: 8, backgroundColor: "#00C46B" },
                        ]}
                      >
                        <Ionicons name="document-text-outline" size={18} color="#fff" />
                      </TouchableOpacity>
                    )}

                    {h.status === "pending" && (
                      <TouchableOpacity
                        onPress={() => cancelLevantamento(h.id)}
                        style={[
                          styles.smallButton,
                          { marginLeft: 8, backgroundColor: "#2a1a24" },
                        ]}
                      >
                        <Ionicons name="close-outline" size={18} color="#fff" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Modal QR */}
        <Modal visible={qrVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.modalTitle}>Apresentar no Caixa</Text>
                <TouchableOpacity
                  onPress={() => setQrVisible(false)}
                  style={{ padding: 6 }}
                >
                  <Ionicons name="close" size={22} color="#999" />
                </TouchableOpacity>
              </View>

              {activeQrItem ? (
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  <View style={styles.qrBox}>
                    <QRCode value={activeQrItem.kzpayCode} size={170} />
                  </View>
                  <Text style={styles.kzpayCode}>{activeQrItem.kzpayCode}</Text>
                  <Text style={styles.kzpayHint}>
                    Entregue este QR ou código ao caixa para confirmar o levantamento
                  </Text>

                  {activeQrItem.status === "pending" && (
                    <Text style={{ color: "#FFD700", marginTop: 6 }}>
                      Expira em: {formatTimer(timeLeft)}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={() => copyKzpayToClipboard(activeQrItem.kzpayCode)}
                    style={[styles.modalButton, { marginTop: 12 }]}
                  >
                    <Ionicons name="copy-outline" size={16} color="#fff" />
                    <Text style={styles.modalButtonText}>Copiar Código</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text>Nenhum detalhe disponível</Text>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#051937" },
  container: { flex: 1 },
  fixedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 10,
    backgroundColor: "#021024",
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#07213a",
  },
  backButton: { backgroundColor: "#06243B", padding: 8, borderRadius: 10 },
  headerTitle: { color: "#8F80FF", fontSize: 18, fontWeight: "700" },
  scrollContent: { paddingTop: 120, paddingHorizontal: 18, paddingBottom: 40 },
  balanceCard: { borderRadius: 20, padding: 25, marginBottom: 25 },
  balanceLabel: { color: "#fff", opacity: 0.8, fontSize: 14 },
  balanceValue: { color: "#fff", fontWeight: "bold", marginTop: 6, fontSize: 22 },
  balanceSub: { color: "#fff", opacity: 0.7, fontSize: 13, marginTop: 4 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#06243B",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  input: { flex: 1, color: "#fff", marginLeft: 10, fontSize: 15 },
  radioRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  radioButton: {
    backgroundColor: "#06243B",
    paddingVertical: 10
  },
  radioButtonActive: { borderWidth: 2, borderColor: "#8F80FF" },
  radioText: { color: "#fff", fontSize: 14 },
  button: { marginTop: 8, borderRadius: 12, overflow: "hidden" },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700", marginLeft: 8 },
  historyTitle: { color: "#8F80FF", fontSize: 16, fontWeight: "700", marginBottom: 12 },
  emptyText: { color: "#fff", fontSize: 14, textAlign: "center", marginTop: 6 },
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#06243B",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  historyText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  historySub: { color: "#8F80FF", fontSize: 12, marginTop: 3 },
  statusText: { fontWeight: "600", fontSize: 13 },
  smallButton: {
    backgroundColor: "#0B3C5D",
    padding: 6,
    borderRadius: 8,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#031D34",
    borderRadius: 16,
    width: "100%",
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { color: "#8F80FF", fontSize: 18, fontWeight: "700" },
  qrBox: { backgroundColor: "#fff", padding: 14, borderRadius: 16, marginTop: 10 },
  kzpayCode: { color: "#fff", fontWeight: "700", fontSize: 16, marginTop: 10 },
  kzpayHint: { color: "#8F80FF", fontSize: 13, textAlign: "center", marginTop: 4 },
  modalButton: {
    backgroundColor: "#8F80FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalButtonText: { color: "#fff", fontWeight: "600", fontSize: 14, marginLeft: 6 },
});
