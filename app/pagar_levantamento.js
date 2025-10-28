import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConfirmarLevantamento() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(false);
  const [codigoManual, setCodigoManual] = useState("");
  const [dadosTransacao, setDadosTransacao] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [etapa, setEtapa] = useState("servidor"); // etapas: servidor → cliente → final
  const [senhaServidor, setSenhaServidor] = useState("");
  const [senhaCliente, setSenhaCliente] = useState("");
  const [status, setStatus] = useState(null);

  // Função chamada ao ler o QR
  const handleBarcodeScanned = ({ data }) => {
    setScanning(false);
    processarCodigo(data);
  };

  // Processa o código QR ou manual
  const processarCodigo = (code) => {
    if (!code) return Alert.alert("Erro", "Código inválido!");

    // Simulação de resposta do servidor
    const mockData = {
      codigo: code,
      cliente: "João Pereira",
      nbt: "9876 5432 1098",
      valor: 25000,
      hora: new Date().toLocaleString(),
      local: "Agência Central - Luanda",
    };

    setDadosTransacao(mockData);
    setEtapa("servidor");
    setModalVisible(true);
  };

  // Simula a confirmação completa
  const finalizarLevantamento = () => {
    if (senhaServidor === "" || senhaCliente === "")
      return Alert.alert("Erro", "As senhas devem ser preenchidas.");

    setStatus("success");
    setTimeout(() => {
      Alert.alert("Sucesso", "Levantamento concluído com sucesso!");
      setModalVisible(false);
      setStatus(null);
      setCodigoManual("");
      setSenhaServidor("");
      setSenhaCliente("");
    }, 1500);
  };

  const recusarLevantamento = () => {
    setStatus("error");
    setTimeout(() => {
      Alert.alert("Recusado", "O levantamento foi cancelado.");
      setModalVisible(false);
      setStatus(null);
    }, 1500);
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("pt-PT").format(Number(v) || 0) + " KZ";

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
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Ionicons name="camera-outline" color="#fff" size={20} />
          <Text style={styles.permissionText}>Ativar Câmara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      {/* Cabeçalho */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#8F80FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar Levantamento</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Scanner */}
      {scanning ? (
        <View style={styles.scannerContainer}>
          <CameraView
            onBarcodeScanned={handleBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            style={{ flex: 1 }}
          />
          <TouchableOpacity
            style={styles.closeScan}
            onPress={() => setScanning(false)}
          >
            <Ionicons name="close" color="#fff" size={22} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.body}>
          <LinearGradient
            colors={["#8F80FF", "#4C44C1", "#1F1C2C"]}
            style={styles.scanCard}
          >
            <Ionicons name="qr-code-outline" size={50} color="#fff" />
            <Text style={styles.scanTitle}>Ler QR Code do Cliente</Text>
            <Text style={styles.scanSubtitle}>
              Aponte a câmara para o QR do cliente para confirmar o levantamento.
            </Text>

            <TouchableOpacity
              onPress={() => setScanning(true)}
              style={styles.scanButton}
            >
              <Ionicons name="camera-outline" color="#fff" size={18} />
              <Text style={styles.scanButtonText}>Iniciar Leitura</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Inserção manual */}
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={20} color="#8F80FF" />
            <TextInput
              placeholder="Ou insira o código KZPay"
              placeholderTextColor="#aaa"
              style={styles.input}
              value={codigoManual}
              onChangeText={setCodigoManual}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => processarCodigo(codigoManual)}
          >
            <LinearGradient colors={["#8F80FF", "#4C44C1"]} style={styles.buttonGradient}>
              <Ionicons name="checkmark-done-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Validar Código</Text>
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
                {dadosTransacao && (
                  <>
                    <Text style={styles.modalTitle}>Confirmar Levantamento</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Cliente:</Text>
                      <Text style={styles.detailValue}>{dadosTransacao.cliente}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>NBT:</Text>
                      <Text style={styles.detailValue}>{dadosTransacao.nbt}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Valor:</Text>
                      <Text style={styles.detailValue}>
                        {formatCurrency(dadosTransacao.valor)}
                      </Text>
                    </View>
                  </>
                )}

                {/* Etapas de senha */}
                {etapa === "servidor" && (
                  <View style={styles.senhaBox}>
                    <Text style={styles.etapaTitle}>Servidor: digite sua senha</Text>
                    <TextInput
                      secureTextEntry
                      placeholder="Senha do servidor"
                      placeholderTextColor="#888"
                      style={styles.inputSenha}
                      value={senhaServidor}
                      onChangeText={setSenhaServidor}
                    />
                    <TouchableOpacity
                      style={styles.nextBtn}
                      onPress={() => setEtapa("cliente")}
                    >
                      <Text style={styles.nextText}>Continuar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {etapa === "cliente" && (
                  <View style={styles.senhaBox}>
                    <Text style={styles.etapaTitle}>Cliente: digite sua senha</Text>
                    <TextInput
                      secureTextEntry
                      placeholder="Senha do cliente"
                      placeholderTextColor="#888"
                      style={styles.inputSenha}
                      value={senhaCliente}
                      onChangeText={setSenhaCliente}
                    />
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <TouchableOpacity
                        style={[styles.modalBtn, { backgroundColor: "#00C46B", flex: 1 }]}
                        onPress={finalizarLevantamento}
                      >
                        <Ionicons name="checkmark" color="#fff" size={18} />
                        <Text style={styles.modalBtnText}>Confirmar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.modalBtn, { backgroundColor: "#FF5C63", flex: 1 }]}
                        onPress={recusarLevantamento}
                      >
                        <Ionicons name="close" color="#fff" size={18} />
                        <Text style={styles.modalBtnText}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- ESTILOS ---
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
  nextBtn: {
    backgroundColor: "#4C44C1",
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  nextText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
