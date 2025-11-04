import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function GestaoCartoes() {
  const router = useRouter();
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [modalNovo, setModalNovo] = useState(false);

  const [novoCartao, setNovoCartao] = useState({
    banco: "KZPay",
    tipo: "",
    numero: "",
    nome: "",
    validade: "",
    status: "Ativo",
    bandeira: "visa",
  });

  const [cartoes, setCartoes] = useState([
    {
      id: 1,
      banco: "KZPay",
      tipo: "Pessoal",
      numero: "0002 9500 0274 8960",
      nome: "Bruno Costa",
      validade: "07/29",
      status: "Ativo",
      bandeira: "visa",
    },
    {
      id: 2,
      banco: "BAI",
      tipo: "Salário",
      numero: "7000 9876 5432 2222",
      nome: "Bruno Costa",
      validade: "09/27",
      status: "Bloqueado",
      bandeira: "mastercard",
    },
  ]);

  const alternarStatus = (id) => {
    setCartoes((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Ativo" ? "Bloqueado" : "Ativo" }
          : c
      )
    );
  };

  const adicionarCartao = () => {
    setModalNovo(true);
  };

  const salvarCartao = () => {
    if (!novoCartao.tipo || !novoCartao.numero || !novoCartao.nome || !novoCartao.validade) {
      return Alert.alert("Campos incompletos", "Preencha todos os campos do cartão.");
    }

    const novo = { ...novoCartao, id: Date.now() };
    setCartoes((prev) => [...prev, novo]);
    setNovoCartao({
      banco: "KZPay",
      tipo: "",
      numero: "",
      nome: "",
      validade: "",
      status: "Ativo",
      bandeira: "visa",
    });
    setModalNovo(false);
    Alert.alert("Cartão adicionado", "O novo cartão foi adicionado com sucesso.");
  };

  const renderBandeira = (tipo) => {
    const logos = {
      visa: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
      mastercard: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    };
    return (
      <Image
        source={{ uri: logos[tipo] }}
        style={{ width: 50, height: 30 }}
        resizeMode="contain"
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestão de Cartões</Text>
        <TouchableOpacity onPress={adicionarCartao}>
          <Ionicons name="add-circle" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de Cartões */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {cartoes.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.cardWrapper, c.status === "Bloqueado" && { opacity: 0.6 }]}
            onPress={() => setCartaoSelecionado(c)}
          >
            <View style={styles.cartaoVisual}>
              <View style={styles.tituloLateral}>
                <Text style={styles.bancoTitulo}>{c.banco}</Text>
                <Text style={styles.tipoTitulo}>{c.tipo}</Text>
              </View>

              <View style={styles.cartaoInfo}>
                <View style={styles.chip} />
                <Text style={styles.numeroCartao}>{c.numero}</Text>
                <View style={styles.linhaInferior}>
                  <Text style={styles.nomeCartao}>{c.nome.toUpperCase()}</Text>
                 
                </View>
                 <Text style={styles.validadeCartao}>
                    VALID THRU {c.validade}
                  </Text>
                <View style={styles.bandeiraContainer}>{renderBandeira(c.bandeira)}</View>
              </View>
            </View>

            <View style={styles.statusWrapper}>
              <Text
                style={[
                  styles.statusTexto,
                  c.status === "Ativo"
                    ? { color: "#4CAF50" }
                    : { color: "#F44336" },
                ]}
              >
                {c.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal para adicionar novo cartão */}
      <Modal visible={modalNovo} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo Cartão</Text>

            {["tipo", "numero", "nome", "validade"].map((campo) => (
              <TextInput
                key={campo}
                placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
                placeholderTextColor="#ccc"
                style={styles.input}
                value={novoCartao[campo]}
                onChangeText={(txt) =>
                  setNovoCartao((prev) => ({ ...prev, [campo]: txt }))
                }
              />
            ))}

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: "#4CAF50" }]}
              onPress={salvarCartao}
            >
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.modalBtnText}>Salvar Cartão</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalNovo(false)}
              style={[styles.modalBtn, { backgroundColor: "#1F1C2C" }]}
            >
              <Ionicons name="close-outline" size={18} color="#fff" />
              <Text style={styles.modalBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de detalhes */}
      <Modal visible={!!cartaoSelecionado} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {cartaoSelecionado && (
              <>
                <Text style={styles.modalTitle}>Detalhes do Cartão</Text>

                {Object.entries(cartaoSelecionado).map(([k, v]) =>
                  k !== "id" ? (
                    <View key={k} style={styles.infoRow}>
                      <Text style={styles.modalLabel}>{k.toUpperCase()}:</Text>
                      <Text style={styles.modalInfo}>{v}</Text>
                    </View>
                  ) : null
                )}

                <TouchableOpacity
                  style={[
                    styles.modalBtn,
                    {
                      backgroundColor:
                        cartaoSelecionado.status === "Ativo"
                          ? "#F44336"
                          : "#4CAF50",
                    },
                  ]}
                  onPress={() => {
                    alternarStatus(cartaoSelecionado.id);
                    setCartaoSelecionado(null);
                  }}
                >
                  <Ionicons
                    name={
                      cartaoSelecionado.status === "Ativo"
                        ? "lock-closed-outline"
                        : "lock-open-outline"
                    }
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.modalBtnText}>
                    {cartaoSelecionado.status === "Ativo"
                      ? "Bloquear"
                      : "Desbloquear"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCartaoSelecionado(null)}
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 10,
    backgroundColor:"#8F80FF",
  },
  backBtn: { padding: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  scroll: { padding: 20 },
  cardWrapper: { marginBottom: 20 },
  cartaoVisual: {
    flexDirection: "row",
    backgroundColor: "#06243B",
    borderRadius: 14,
    padding: 20,
    width: "100%",
    aspectRatio: 1.9,
  },
  tituloLateral: {
    justifyContent: "center",
    alignItems: "center",
    width: "25%",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.3)",
  },
  bancoTitulo: { color: "#8F80FF", fontSize: 16, fontWeight: "700" },
  tipoTitulo: { color: "#fff", fontSize: 14, marginTop: 4 },
  cartaoInfo: { flex: 1, paddingLeft: 15, justifyContent: "space-between" },
  chip: {
    width: 40,
    height: 30,
    backgroundColor: "#D4AF37",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  numeroCartao: { color: "#fff", fontSize: 18, letterSpacing: 2 },
  linhaInferior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nomeCartao: { color: "#fff", fontSize: 14, fontWeight: "600" },
  validadeCartao: { color: "#fff", fontSize: 12, marginVertical:25 },
  bandeiraContainer: { alignSelf: "flex-end" },
  statusWrapper: { marginTop: 8, alignItems: "flex-end" },
  statusTexto: { fontSize: 14, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#031D34",
    borderRadius: 16,
    padding: 22,
    width: "90%",
  },
  modalTitle: {
    color: "#8F80FF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#0B2A45",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  modalLabel: { color: "#8F80FF", fontSize: 13, fontWeight: "600" },
  modalInfo: { color: "#fff", fontSize: 14 },
  modalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 10,
  },
  modalBtnText: { color: "#fff", marginLeft: 8, fontWeight: "600" },
});
