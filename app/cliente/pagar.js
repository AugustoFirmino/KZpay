import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PagamentoPage() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const [modo, setModo] = useState("qr"); // 'qr' ou 'manual'
  const [scanning, setScanning] = useState(false);
  const [codigoManual, setCodigoManual] = useState("");
  const [dadosPagamento, setDadosPagamento] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [senhaCliente, setSenhaCliente] = useState("");
  const [status, setStatus] = useState(null);
  const [entidade, setEntidade] = useState("");
  const [valorManual, setValorManual] = useState("");
  const [clienteNBT, setClienteNBT] = useState(null);

  // --- MOCK de clientes no sistema ---
  const mockClientes = [
    { id: "1001", nome: "Maria António", nbt: "1234 5678 9876" },
    { id: "1002", nome: "Augusto Firmino Correia", nbt: "9876 5432 1122" },
    { id: "2001", nome: "Carlos Domingos", nbt: "1122 3344 5566" },
  ];

  // Buscar o cliente automaticamente pelo ID digitado no campo "entidade"
  useEffect(() => {
    if (!entidade) {
      setClienteNBT(null);
      return;
    }
    const cliente = mockClientes.find((c) => c.id === entidade);
    setClienteNBT(cliente || null);
  }, [entidade]);

  // --- Função para QR ---
  const handleBarcodeScanned = ({ data }) => {
    setScanning(false);
    processarCodigo(data);
  };

  const processarCodigo = (code) => {
    if (!code) return Alert.alert("Erro", "Código inválido!");

    const mockData = {
      referencia: code,
      cliente: "Maria António",
      nbt: "1234 5678 9876",
      valor: 12500,
      descricao: "Pagamento de Transporte Urbano",
      hora: new Date().toLocaleString(),
      local: "Terminal Mutamba - Luanda",
    };

    setDadosPagamento(mockData);
    setModalVisible(true);
  };

  // --- Função para pagamento manual ---
  const validarManual = () => {
    if (!entidade || !valorManual)
      return Alert.alert("Erro", "Preencha todos os campos.");

    if (!clienteNBT)
      return Alert.alert("Erro", "Nenhum cliente encontrado para essa entidade.");

    const mockData = {
      cliente: clienteNBT.nome,
      nbt: clienteNBT.nbt,
      valor: Number(valorManual),
      descricao: `Pagamento à entidade ${entidade}`,
      hora: new Date().toLocaleString(),
    };

    setDadosPagamento(mockData);
    setModalVisible(true);
  };

  // --- Confirmar Pagamento ---
  const finalizarPagamento = () => {
    if (!senhaCliente) return Alert.alert("Erro", "Digite a senha para confirmar.");

    setStatus("success");
    setTimeout(() => {
      Alert.alert("Sucesso", "Pagamento confirmado com sucesso!");
      setModalVisible(false);
      resetarCampos();
    }, 1500);
  };

  const recusarPagamento = () => {
    setStatus("error");
    setTimeout(() => {
      Alert.alert("Cancelado", "O pagamento foi cancelado.");
      setModalVisible(false);
      resetarCampos();
    }, 1500);
  };

  const resetarCampos = () => {
    setStatus(null);
    setCodigoManual("");
    setSenhaCliente("");
    setEntidade("");
    setValorManual("");
    setDadosPagamento(null);
    setClienteNBT(null);
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("pt-PT").format(Number(v) || 0) + " KZ";

  // --- Verificação da permissão da câmara ---
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>A carregar permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff", marginBottom: 20 }}>
          A câmara precisa de permissão para funcionar.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Ionicons name="camera-outline" color="#fff" size={20} />
          <Text style={styles.permissionText}>Ativar Câmara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Layout Principal ---
  return (
    <View style={styles.safeArea}>
      {/* Cabeçalho */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#8F80FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Alternar modo */}
      <View style={styles.modeSwitch}>
        <TouchableOpacity
          onPress={() => setModo("qr")}
          style={[styles.modeBtn, modo === "qr" && styles.activeMode]}
        >
          <Ionicons name="qr-code-outline" size={18} color="#fff" />
          <Text style={styles.modeText}>QR / KZPay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModo("manual")}
          style={[styles.modeBtn, modo === "manual" && styles.activeMode]}
        >
          <Ionicons name="cash-outline" size={18} color="#fff" />
          <Text style={styles.modeText}>Entidade Manual</Text>
        </TouchableOpacity>
      </View>

      {/* Corpo */}
      {modo === "qr" ? (
        scanning ? (
          <View style={styles.scannerContainer}>
            <CameraView
              onBarcodeScanned={handleBarcodeScanned}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              style={{ flex: 1 }}
            />
            <TouchableOpacity style={styles.closeScan} onPress={() => setScanning(false)}>
              <Ionicons name="close" color="#fff" size={22} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.body}>
            <LinearGradient colors={["#8F80FF", "#4C44C1", "#1F1C2C"]} style={styles.scanCard}>
              <Ionicons name="qr-code-outline" size={50} color="#fff" />
              <Text style={styles.scanTitle}>Ler QR Code KZPay</Text>
              <Text style={styles.scanSubtitle}>
                Aponte a câmara para o QR do fornecedor para pagar.
              </Text>
              <TouchableOpacity onPress={() => setScanning(true)} style={styles.scanButton}>
                <Ionicons name="camera-outline" color="#fff" size={18} />
                <Text style={styles.scanButtonText}>Iniciar Leitura</Text>
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={20} color="#8F80FF" />
              <TextInput
                placeholder="Ou insira a referência KZPay"
                placeholderTextColor="#aaa"
                style={styles.input}
                keyboardType="numeric"
                value={codigoManual}
                onChangeText={(t) => setCodigoManual(t.replace(/[^0-9]/g, ""))}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => processarCodigo(codigoManual)}>
              <LinearGradient colors={["#8F80FF", "#4C44C1"]} style={styles.buttonGradient}>
                <Ionicons name="checkmark-done-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Validar Referência</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <View style={styles.body}>
          <Text style={styles.manualLabel}>Pagamento Manual</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="business-outline" size={20} color="#8F80FF" />
            <TextInput
              placeholder="Entidade (ex: 1001)"
              placeholderTextColor="#aaa"
              style={styles.input}
              keyboardType="numeric"
              value={entidade}
              onChangeText={(t) => setEntidade(t.replace(/[^0-9]/g, ""))}
            />
          </View>

          {clienteNBT && (
            <View style={{ marginBottom: 10, marginLeft: 6 }}>
              <Text style={{ color: "#8F80FF" }}>Cliente: {clienteNBT.nome}</Text>
              <Text style={{ color: "#aaa" }}>NBT: {clienteNBT.nbt}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#8F80FF" />
            <TextInput
              placeholder="Valor (KZ)"
              placeholderTextColor="#aaa"
              style={styles.input}
              keyboardType="numeric"
              value={valorManual}
              onChangeText={(t) => setValorManual(t.replace(/[^0-9]/g, ""))}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={validarManual}>
            <LinearGradient colors={["#8F80FF", "#4C44C1"]} style={styles.buttonGradient}>
              <Ionicons name="checkmark-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Validar Pagamento</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de confirmação */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {status ? (
              <View style={styles.centerContent}>
                {status === "success" && (
                  <Ionicons name="checkmark-circle" size={100} color="#00D26A" />
                )}
                {status === "error" && (
                  <Ionicons name="close-circle" size={100} color="#FF5C63" />
                )}
              </View>
            ) : (
              <>
                {dadosPagamento && (
                  <>
                    <Text style={styles.modalTitle}>Confirmar Pagamento</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Cliente:</Text>
                      <Text style={styles.detailValue}>{dadosPagamento.cliente}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>NBT:</Text>
                      <Text style={styles.detailValue}>{dadosPagamento.nbt}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Serviço:</Text>
                      <Text style={styles.detailValue}>{dadosPagamento.descricao}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Valor:</Text>
                      <Text style={styles.detailValue}>
                        {formatCurrency(dadosPagamento.valor)}
                      </Text>
                    </View>
                  </>
                )}
                <View style={styles.senhaBox}>
                  <Text style={styles.etapaTitle}>Confirme com a sua senha</Text>
                  <TextInput
                    secureTextEntry
                    placeholder="Senha do cliente"
                    placeholderTextColor="#888"
                    style={styles.inputSenha}
                    keyboardType="numeric"
                    value={senhaCliente}
                    onChangeText={(t) => setSenhaCliente(t.replace(/[^0-9]/g, ""))}
                  />
                  <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <TouchableOpacity
                      style={[styles.modalBtn, { backgroundColor: "#00C46B", flex: 1 }]}
                      onPress={finalizarPagamento}
                    >
                      <Ionicons name="checkmark" color="#fff" size={18} />
                      <Text style={styles.modalBtnText}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalBtn, { backgroundColor: "#FF5C63", flex: 1 }]}
                      onPress={recusarPagamento}
                    >
                      <Ionicons name="close" color="#fff" size={18} />
                      <Text style={styles.modalBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#051937" },
  fixedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 10,
    backgroundColor: "#021024",
    borderBottomWidth: 1,
    borderBottomColor: "#07213a",
  },
  backButton: { backgroundColor: "#06243B", padding: 8, borderRadius: 10 },
  headerTitle: { color: "#8F80FF", fontSize: 18, fontWeight: "700" },
  modeSwitch: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#031D34",
    paddingVertical: 10,
  },
  modeBtn: { flexDirection: "row", alignItems: "center", gap: 6, padding: 10 },
  activeMode: { borderBottomWidth: 3, borderBottomColor: "#8F80FF" },
  modeText: { color: "#fff", fontWeight: "600" },
  body: { padding: 20 },
  scanCard: {
    borderRadius: 18,
    padding: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  scanTitle: { color: "#fff", fontWeight: "700", fontSize: 18, marginTop: 10 },
  scanSubtitle: { color: "#ddd", textAlign: "center", marginTop: 6, fontSize: 13 },
  scanButton: {
    flexDirection: "row",
    backgroundColor: "#2D2A4A",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  scanButtonText: { color: "#fff", marginLeft: 6, fontWeight: "600" },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#06243B",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 6,
  },
  input: { flex: 1, color: "#fff", marginLeft: 8 },
  button: { marginTop: 16, borderRadius: 12, overflow: "hidden" },
  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  buttonText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
  manualLabel: { color: "#8F80FF", fontSize: 16, marginBottom: 10, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#031D34",
    width: "100%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { color: "#8F80FF", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: { color: "#8F80FF", fontSize: 14 },
  detailValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  modalBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  modalBtnText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
  scannerContainer: { flex: 1 },
  closeScan: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 10,
  },
  center: {
    flex: 1,
    backgroundColor: "#051937",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionButton: {
    flexDirection: "row",
    backgroundColor: "#4C44C1",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  permissionText: { color: "#fff", marginLeft: 8, fontWeight: "600" },
  centerContent: { alignItems: "center", justifyContent: "center", padding: 30 },
  senhaBox: { marginTop: 20 },
  etapaTitle: { color: "#8F80FF", fontWeight: "600", marginBottom: 8 },
  inputSenha: {
    backgroundColor: "#06243B",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: "#fff",
  },
});
