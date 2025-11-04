import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CompraPage() {
  const router = useRouter();

  const [modo, setModo] = useState("qr");
  const [codigoManual, setCodigoManual] = useState("");
  const [dadosCompra, setDadosCompra] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [senhaCliente, setSenhaCliente] = useState("");
  const [status, setStatus] = useState(null);
  const [valorCompra, setValorCompra] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [entidadeSelecionada, setEntidadeSelecionada] = useState(null);

  // Simulação de 10 entidades
  const entidades = [
    { id: "1001", nome: "Maria António" },
    { id: "1002", nome: "Augusto Correia" },
    { id: "1003", nome: "Carlos Domingos" },
    { id: "1004", nome: "Ana Silva" },
    { id: "1005", nome: "João Pereira" },
    { id: "1006", nome: "Sofia Costa" },
    { id: "1007", nome: "Miguel Santos" },
    { id: "1008", nome: "Carla Fernandes" },
    { id: "1009", nome: "Paulo Oliveira" },
    { id: "1010", nome: "Rita Gomes" },
  ];

  const entidadesFiltradas = entidades.filter((e) =>
    e.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const validarCompra = () => {
    if (!entidadeSelecionada || !valorCompra)
      return Alert.alert("Erro", "Escolha uma entidade e informe o valor.");

    const mockData = {
      cliente: entidadeSelecionada.nome,
      valor: Number(valorCompra),
      descricao: `Compra para ${entidadeSelecionada.nome}`,
      hora: new Date().toLocaleString(),
    };

    setDadosCompra(mockData);
    setModalVisible(true);
  };

  const finalizarCompra = () => {
    if (!senhaCliente) return Alert.alert("Erro", "Digite a senha para confirmar.");

    setStatus("success");
    setTimeout(() => {
      Alert.alert("Sucesso", "Compra realizada com sucesso!");
      setModalVisible(false);
      resetarCampos();
    }, 1500);
  };

  const cancelarCompra = () => {
    setStatus("error");
    setTimeout(() => {
      Alert.alert("Cancelado", "A compra foi cancelada.");
      setModalVisible(false);
      resetarCampos();
    }, 1500);
  };

  const resetarCampos = () => {
    setStatus(null);
    setCodigoManual("");
    setSenhaCliente("");
    setValorCompra("");
    setPesquisa("");
    setEntidadeSelecionada(null);
    setDadosCompra(null);
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("pt-PT").format(Number(v) || 0) + " KZ";

  return (
    <ScrollView style={styles.safeArea}>
      {/* Cabeçalho */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compra</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Alternar modo */}
      <View style={styles.modeSwitch}>
        <TouchableOpacity
          onPress={() => setModo("qr")}
          style={[styles.modeBtn, modo === "qr" && styles.activeMode]}
        >
          <Ionicons name="qr-code-outline" size={18} color="#fff" />
          <Text style={styles.modeText}>QR / Todos</Text>
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
        <View style={styles.body}>
          <LinearGradient colors={["#8F80FF", "#4C44C1"]} style={styles.scanCard}>
            <Ionicons name="qr-code-outline" size={50} color="#fff" />
            <Text style={styles.scanTitle}>Ler QR Code</Text>
            <Text style={styles.scanSubtitle}>
              Aponte a câmara para o QR do fornecedor para comprar.
            </Text>
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.body}>
          <Text style={styles.manualLabel}>Compra Manual</Text>
          <TextInput
            placeholder="Pesquisar entidade..."
            placeholderTextColor="#666"
            style={styles.input}
            value={pesquisa}
            onChangeText={setPesquisa}
          />

          <FlatList
            data={entidadesFiltradas}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 250, marginVertical: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.entidadeItem,
                  entidadeSelecionada?.id === item.id && styles.entidadeSelecionada,
                ]}
                onPress={() => setEntidadeSelecionada(item)}
              >
                <Text style={{ color: "#4C44C1" }}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#4C44C1" />
            <TextInput
              placeholder="Valor (KZ)"
              placeholderTextColor="#666"
              style={styles.input}
              keyboardType="numeric"
              value={valorCompra}
              onChangeText={(t) => setValorCompra(t.replace(/[^0-9]/g, ""))}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={validarCompra}>
            <LinearGradient colors={["#8F80FF", "#4C44C1"]} style={styles.buttonGradient}>
              <Ionicons name="checkmark-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>Validar Compra</Text>
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
                {dadosCompra && (
                  <>
                    <Text style={styles.modalTitle}>Confirmar Compra</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Cliente:</Text>
                      <Text style={styles.detailValue}>{dadosCompra.cliente}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Valor:</Text>
                      <Text style={styles.detailValue}>
                        {formatCurrency(dadosCompra.valor)}
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
                      onPress={finalizarCompra}
                    >
                      <Ionicons name="checkmark" color="#fff" size={18} />
                      <Text style={styles.modalBtnText}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalBtn, { backgroundColor: "#FF5C63", flex: 1 }]}
                      onPress={cancelarCompra}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  fixedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 10,
    backgroundColor: "#8F80FF",
    borderBottomWidth: 1,
    borderBottomColor: "#7A6FE8",
  },
  backButton: {  padding: 8, borderRadius: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  modeSwitch: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E8E8FF",
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  modeBtn: { flexDirection: "row", alignItems: "center", gap: 6, padding: 10 },
  activeMode: { borderBottomWidth: 3, borderBottomColor: "#4C44C1" },
  modeText: { color: "#4C44C1", fontWeight: "600" },
  body: { padding: 20 },
  scanCard: {
    borderRadius: 18,
    padding: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    backgroundColor: "#4C44C1",
  },
  scanTitle: { color: "#fff", fontWeight: "700", fontSize: 18, marginTop: 10 },
  scanSubtitle: { color: "#ddd", textAlign: "center", marginTop: 6, fontSize: 13 },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#F0F0FF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 6,
  },
  input: { flex: 1, color: "#333", marginLeft: 8 },
  button: { marginTop: 16, borderRadius: 12, overflow: "hidden" },
  buttonGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
  manualLabel: { color: "#4C44C1", fontSize: 16, marginBottom: 10, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { color: "#4C44C1", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: { color: "#4C44C1", fontSize: 14 },
  detailValue: { color: "#333", fontSize: 14, fontWeight: "600" },
  modalBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  modalBtnText: { color: "#fff", fontWeight: "700", marginLeft: 6 },
  centerContent: { alignItems: "center", justifyContent: "center", padding: 30 },
  senhaBox: { marginTop: 20 },
  etapaTitle: { color: "#4C44C1", fontWeight: "600", marginBottom: 8 },
  inputSenha: {
    backgroundColor: "#F0F0FF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: "#333",
  },
  entidadeItem: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 4,
  },
  entidadeSelecionada: {
    backgroundColor: "#4C44C1",
    borderColor: "#4C44C1",
  },
});
