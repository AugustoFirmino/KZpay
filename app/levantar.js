import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
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

  // Saldo inicial (podes buscar do backend mais tarde)
  const [saldo, setSaldo] = useState(245000);

  // campos do form
  const [valor, setValor] = useState("");
  const [metodo, setMetodo] = useState("IBAN");
  const [referencia, setReferencia] = useState("");
  const [pin, setPin] = useState("");

  // titular detectado
  const [titular, setTitular] = useState(null);

  // histórico de levantamentos (local)
  const [history, setHistory] = useState([]);

  // modal QR
  const [qrVisible, setQrVisible] = useState(false);
  const [activeQrItem, setActiveQrItem] = useState(null);

  // Base de dados simulada
  const contasFake = [
    { metodo: "IBAN", ref: "AO060012345678901234567", nome: "Carlos Alberto", pais: "Angola" },
    { metodo: "Telefone", ref: "923456789", nome: "Maria João", pais: "Angola" },
    { metodo: "Conta", ref: "1234567890", nome: "Jorge Manuel", pais: "Angola" },
  ];

  const metodos = [
    { id: "IBAN", icon: "card-outline", label: "IBAN" },
    { id: "Telefone", icon: "call-outline", label: "Telefone" },
    { id: "Conta", icon: "wallet-outline", label: "Nº de Conta" },
  ];

  // --- Buscar titular conforme método e referência ---
  const buscarTitular = (valorRef, metodoAtual) => {
    const match = contasFake.find(
      (c) =>
        c.metodo === metodoAtual &&
        valorRef &&
        c.ref.toLowerCase().includes(valorRef.toLowerCase())
    );
    setTitular(match || null);
  };

  // Função principal do levantamento
  const handleLevantamento = () => {
    if (!valor || !referencia || !pin) {
      Alert.alert("Erro", "Por favor preencha todos os campos!");
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

    // Gerar código KZPay único simples
    const kzpayCode = `KZPAY-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `${Date.now()}`;

    const newItem = {
      id,
      valor: valorNum,
      valorStr: formatCurrency(valorNum),
      metodo,
      referencia,
      kzpayCode,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Atualizar histórico
    setHistory((h) => [newItem, ...h]);

    // Atualizar saldo
    setSaldo((s) => s - valorNum);

    // Abrir modal com QR
    setActiveQrItem(newItem);
    setQrVisible(true);

    // Limpar campos
    setValor("");
    setReferencia("");
    setPin("");
    setTitular(null);
  };

  // Marcar como confirmado
  const confirmAtCashier = (itemId) => {
    setHistory((h) =>
      h.map((it) => (it.id === itemId ? { ...it, status: "confirmed" } : it))
    );
    if (activeQrItem && activeQrItem.id === itemId) {
      setActiveQrItem((p) => (p ? { ...p, status: "confirmed" } : p));
    }
    Alert.alert("Confirmado", "Levantamento confirmado no caixa!");
  };

  // Cancelar levantamento (e devolver saldo)
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
          if (activeQrItem && activeQrItem.id === itemId) {
            setActiveQrItem((p) => (p ? { ...p, status: "cancelled" } : p));
          }
        },
      },
    ]);
  };

  const openQrModalForItem = (item) => {
    setActiveQrItem(item);
    setQrVisible(true);
  };

  const copyKzpayToClipboard = (code) => {
    try {
      Clipboard.setString(code);
      Alert.alert("Copiado", "Código KZPay copiado para a área de transferência.");
    } catch {
      Alert.alert("Erro", "Não foi possível copiar o código.");
    }
  };

  function formatCurrency(v) {
    let n = typeof v === "number" ? v : Number(String(v).replace(/\D/g, ""));
    if (isNaN(n)) n = 0;
    return new Intl.NumberFormat("pt-PT").format(n) + " KZ";
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho fixo */}
        <View style={styles.fixedHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#00BFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Levantamento</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Saldo */}
          <LinearGradient colors={["#007BFF", "#00BFFF"]} style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Saldo Disponível</Text>
            <Text style={styles.balanceValue}>{formatCurrency(saldo)}</Text>
            <Text style={styles.balanceSub}>Atualizado agora</Text>
          </LinearGradient>

          {/* Métodos */}
          <Text style={styles.sectionTitle}>Escolha o método de levantamento</Text>
          <View style={styles.methodRow}>
            {metodos.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[styles.methodButton, metodo === m.id && styles.methodButtonActive]}
                onPress={() => {
                  setMetodo(m.id);
                  setReferencia("");
                  setTitular(null);
                }}
              >
                <Ionicons
                  name={m.icon}
                  size={22}
                  color={metodo === m.id ? "#00BFFF" : "#fff"}
                />
                <Text
                  style={[
                    styles.methodText,
                    metodo === m.id && { color: "#00BFFF", fontWeight: "600" },
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Inputs */}
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#00BFFF" />
            <TextInput
              style={styles.input}
              placeholder="Valor a levantar (KZ)"
              placeholderTextColor="#cfcfcf"
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name={
                metodo === "IBAN"
                  ? "card-outline"
                  : metodo === "Telefone"
                  ? "call-outline"
                  : "wallet-outline"
              }
              size={20}
              color="#00BFFF"
            />
            <TextInput
              style={styles.input}
              placeholder={
                metodo === "IBAN"
                  ? "Digite o IBAN completo"
                  : metodo === "Telefone"
                  ? "Digite o telefone"
                  : "Digite o número da conta"
              }
              placeholderTextColor="#cfcfcf"
              keyboardType={metodo === "Telefone" ? "phone-pad" : "default"}
              value={referencia}
              onChangeText={(txt) => {
                setReferencia(txt);
                buscarTitular(txt, metodo);
              }}
            />
          </View>

          {/* Mostra nome e país se encontrado */}
          {titular && (
            <View style={styles.titularBox}>
              <Ionicons name="person-circle-outline" size={26} color="#00BFFF" />
              <View>
                <Text style={styles.titularNome}>{titular.nome}</Text>
                <Text style={styles.titularPais}>{titular.pais}</Text>
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#00BFFF" />
            <TextInput
              style={styles.input}
              placeholder="PIN de segurança"
              placeholderTextColor="#cfcfcf"
              secureTextEntry
              keyboardType="numeric"
              maxLength={4}
              value={pin}
              onChangeText={setPin}
            />
          </View>

          {/* Botão Confirmar */}
          <TouchableOpacity style={styles.button} onPress={handleLevantamento}>
            <LinearGradient colors={["#007BFF", "#00BFFF"]} style={styles.buttonGradient}>
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
                    {h.metodo} • {new Date(h.createdAt).toLocaleString()}
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

                    {h.status === "pending" && (
                      <TouchableOpacity
                        onPress={() => cancelLevantamento(h.id)}
                        style={[styles.smallButton, { marginLeft: 8, backgroundColor: "#2a1a24" }]}
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

        {/* Modal QR Code */}
        <Modal visible={qrVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.modalTitle}>Apresentar no Caixa</Text>
                <TouchableOpacity onPress={() => setQrVisible(false)} style={{ padding: 6 }}>
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

                  <View style={{ flexDirection: "row", marginTop: 12 }}>
                    <TouchableOpacity
                      onPress={() => copyKzpayToClipboard(activeQrItem.kzpayCode)}
                      style={[styles.modalButton, { marginRight: 8 }]}
                    >
                      <Ionicons name="copy-outline" size={16} color="#fff" />
                      <Text style={styles.modalButtonText}>Copiar Código</Text>
                    </TouchableOpacity>

                    {activeQrItem.status === "pending" && (
                      <TouchableOpacity
                        onPress={() => confirmAtCashier(activeQrItem.id)}
                        style={[styles.modalButton, { backgroundColor: "#00C46B" }]}
                      >
                        <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                        <Text style={styles.modalButtonText}>Confirmar no Caixa</Text>
                      </TouchableOpacity>
                    )}
                  </View>
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
  headerTitle: { color: "#00BFFF", fontSize: 18, fontWeight: "700" },
  scrollContent: { paddingTop: 120, paddingHorizontal: 18, paddingBottom: 40 },
  balanceCard: {
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginBottom: 18,
  },
  balanceLabel: { color: "#fff", opacity: 0.95, fontSize: 13 },
  balanceValue: { color: "#fff", fontSize: 28, fontWeight: "700", marginTop: 6 },
  balanceSub: { color: "#E6F3FF", fontSize: 12, marginTop: 4 },
  sectionTitle: { color: "#fff", fontSize: 15, fontWeight: "600", marginBottom: 12 },
  methodRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  methodButton: {
    backgroundColor: "#06243B",
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  methodButtonActive: { borderColor: "#00BFFF", borderWidth: 2 },
  methodText: { color: "#fff", marginTop: 6 },
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
  titularBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A2A45",
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  titularNome: { color: "#fff", fontSize: 15, fontWeight: "600" },
  titularPais: { color: "#b8dcff", fontSize: 13 },
  button: { marginTop: 8, borderRadius: 12, overflow: "hidden" },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700", marginLeft: 8 },
    historyTitle: { 
    color: "#00BFFF", 
    fontSize: 16, 
    fontWeight: "700", 
    marginBottom: 12 
  },
  emptyText: { 
    color: "#9BBBD4", 
    fontSize: 14, 
    textAlign: "center", 
    marginTop: 6 
  },
  historyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#06243B",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  historyText: { 
    color: "#fff", 
    fontSize: 15, 
    fontWeight: "600" 
  },
  historySub: { 
    color: "#9BBBD4", 
    fontSize: 12, 
    marginTop: 3 
  },
  statusText: { 
    fontWeight: "600", 
    fontSize: 13 
  },
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
  modalTitle: {
    color: "#00BFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  qrBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  kzpayCode: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 10,
  },
  kzpayHint: {
    color: "#9BBBD4",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 6,
  },
});
