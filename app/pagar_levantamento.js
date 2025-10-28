import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ConfirmarLevantamento() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [codigoManual, setCodigoManual] = useState("");
  const [dadosTransacao, setDadosTransacao] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState(null);

  // Solicitar permissão da câmara
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // Ao ler o QR Code
  const handleScan = ({ data }) => {
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
    setModalVisible(true);
  };

  const confirmarLevantamento = () => {
    setStatus("success");
    setTimeout(() => {
      Alert.alert("Sucesso", "Levantamento confirmado com sucesso!");
      setModalVisible(false);
      setStatus(null);
      setCodigoManual("");
    }, 1500);
  };

  const recusarLevantamento = () => {
    setStatus("error");
    setTimeout(() => {
      Alert.alert("Recusado", "O levantamento foi recusado.");
      setModalVisible(false);
      setStatus(null);
    }, 1500);
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("pt-PT").format(Number(v) || 0) + " KZ";

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff", marginBottom: 20 }}>
          Permissão da câmara negada.
        </Text>
        <TouchableOpacity
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }}
          style={styles.permissionButton}
        >
          <Ionicons name="camera-outline" color="#fff" size={20} />
          <Text style={styles.permissionText}>Ativar Câmara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
            <Camera
              style={{ flex: 1 }}
              type={Camera.Constants.Type.back}
              onBarCodeScanned={handleScan}
              ratio="16:9"
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
              {status === "success" && (
                <Ionicons name="checkmark-circle" size={60} color="#00D26A" />
              )}
              {status === "error" && (
                <Ionicons name="close-circle" size={60} color="#FF5C63" />
              )}

              {!status && dadosTransacao && (
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
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Código:</Text>
                    <Text style={styles.detailValue}>{dadosTransacao.codigo}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Hora:</Text>
                    <Text style={styles.detailValue}>{dadosTransacao.hora}</Text>
                  </View>
                </>
              )}

              {!status && (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: "#00C46B" }]}
                    onPress={confirmarLevantamento}
                  >
                    <Ionicons name="checkmark" color="#fff" size={18} />
                    <Text style={styles.modalBtnText}>Confirmar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: "#FF5C63" }]}
                    onPress={recusarLevantamento}
                  >
                    <Ionicons name="close" color="#fff" size={18} />
                    <Text style={styles.modalBtnText}>Recusar</Text>
                  </TouchableOpacity>
                </View>
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
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
});
