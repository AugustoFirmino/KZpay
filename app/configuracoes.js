import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Página de Configurações de Conta • KZPay
 *
 * Observações:
 * - Tudo aqui é mock / frontend — ações sensíveis (alterar senha, apagar conta, adicionar cartão)
 *   mostram diálogos ou atualizam estados locais apenas para demonstração.
 * - Para integração real, ligar a chamadas de API no lugar dos mocks/AsyncStorage.
 */

export default function KZPaySettingsPage() {
  const router = useRouter();

  // Dados do utilizador (mock)
  const [user, setUser] = useState({
    nome: "Augusto Firmino Correia",
    nbt: "9876 5432 1122",
    email: "augusto@example.com",
    telefone: "+244912345678",
    tipoConta: "Pessoal",
    status: "Ativa",
    foto:
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  });

  // Segurança & preferências
  const [useBiometry, setUseBiometry] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [notifsPush, setNotifsPush] = useState(true);
  const [notifsEmail, setNotifsEmail] = useState(true);
  const [limiteDiario, setLimiteDiario] = useState("50000"); // KZ
  const [temaEscuro, setTemaEscuro] = useState(true);
  const [idioma, setIdioma] = useState("pt-PT");

  // Cartões / contas vinculadas (mock)
  const [cards, setCards] = useState([
    { id: "c1", brand: "Visa", last4: "4242", holder: "A. Correia", expiry: "12/26" },
    { id: "c2", brand: "Mastercard", last4: "8899", holder: "A. Correia", expiry: "07/25" },
  ]);
  const [bankAccounts, setBankAccounts] = useState([
    { id: "b1", bank: "BNA", acc: "0001234567" },
  ]);

  // Devices (mock)
  const [devices, setDevices] = useState([
    { id: "d1", name: "Samsung Galaxy A52", last: "2025-10-10 08:30" },
    { id: "d2", name: "iPhone 14", last: "2025-09-22 16:12" },
  ]);

  // Modais simples
  const [modalSenha, setModalSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [modalAddCard, setModalAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");

  // Carregar preferências guardadas (AsyncStorage - mock)
  useEffect(() => {
    (async () => {
      try {
        const storedTema = await AsyncStorage.getItem("kz_temaEscuro");
        const storedIdioma = await AsyncStorage.getItem("kz_idioma");
        const storedTwoFA = await AsyncStorage.getItem("kz_2fa");
        if (storedTema !== null) setTemaEscuro(storedTema === "true");
        if (storedIdioma) setIdioma(storedIdioma);
        if (storedTwoFA) setTwoFA(storedTwoFA === "true");
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // Handlers
  const toggleBiometry = async (v) => {
    setUseBiometry(v);
    Alert.alert("Biometria", v ? "Biometria ativada" : "Biometria desativada");
  };

  const toggleTwoFA = async (v) => {
    setTwoFA(v);
    await AsyncStorage.setItem("kz_2fa", v ? "true" : "false");
    Alert.alert("Autenticação", v ? "2FA ativada (mock)" : "2FA desativada (mock)");
  };

  const toggleTema = async (v) => {
    setTemaEscuro(v);
    await AsyncStorage.setItem("kz_temaEscuro", v ? "true" : "false");
  };

  const alterarLimite = (text) => {
    // aceita só números
    const numeric = text.replace(/[^\d]/g, "");
    setLimiteDiario(numeric);
  };

  const handleSalvarLimite = () => {
    Alert.alert("Limite diário", `Limite atualizado para ${formatCurrency(limiteDiario)}`);
  };

  const abrirEditarPerfil = () => {
    Alert.alert("Editar Perfil", "Aqui abriria o formulário para editar perfil (mock).");
  };

  const handleChangePassword = () => {
    if (!novaSenha || !confirmSenha) return Alert.alert("Erro", "Preencha as duas palavras-passe.");
    if (novaSenha !== confirmSenha) return Alert.alert("Erro", "As palavras-passe não coincidem.");
    // mock alteração
    setModalSenha(false);
    setNovaSenha("");
    setConfirmSenha("");
    Alert.alert("Senha", "Palavra-passe alterada com sucesso (mock).");
  };

  const handleAddCard = () => {
    if (!cardNumber || !cardName || !cardExpiry) return Alert.alert("Erro", "Preencha todos os campos do cartão.");
    const last4 = cardNumber.slice(-4);
    const newCard = {
      id: `c${Date.now()}`,
      brand: "Cartão",
      last4,
      holder: cardName,
      expiry: cardExpiry,
    };
    setCards((c) => [newCard, ...c]);
    setModalAddCard(false);
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    Alert.alert("Cartão", "Cartão adicionado (mock).");
  };

  const removerCartao = (id) => {
    Alert.alert("Remover cartão", "Deseja remover este cartão?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: () => {
          setCards((c) => c.filter((x) => x.id !== id));
          Alert.alert("Removido", "O cartão foi removido (mock).");
        },
      },
    ]);
  };

  const desconectarDispositivo = (id) => {
    Alert.alert("Desconectar dispositivo", "Remover dispositivo da conta?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        onPress: () => {
          setDevices((d) => d.filter((x) => x.id !== id));
          Alert.alert("Dispositivo", "Dispositivo removido (mock).");
        },
      },
    ]);
  };

  const solicitarSuporte = () => {
    const phone = "+244912345678";
    const text = encodeURIComponent("Olá, preciso de ajuda com minha conta KZPay.");
    Linking.openURL(`https://wa.me/${phone.replace(/\D/g, "")}?text=${text}`).catch(() =>
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.")
    );
  };

  const logout = async () => {
    await AsyncStorage.clear();
    Alert.alert("Sair", "Sessão terminada (mock).");
    router.push("/login");
  };

  const apagarConta = () => {
    Alert.alert(
      "Apagar Conta",
      "Esta ação apagará permanentemente sua conta. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: async () => {
            // mock apagar
            await AsyncStorage.clear();
            Alert.alert("Conta apagada", "Sua conta foi apagada (mock).");
            router.push("/goodbye");
          },
        },
      ]
    );
  };

  const formatCurrency = (v) => new Intl.NumberFormat("pt-PT").format(Number(v) || 0) + " KZ";

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Configurações • KZPay</Text>

        <TouchableOpacity onPress={solicitarSuporte} style={styles.iconButton}>
          <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Perfil */}
        <View style={styles.section}>
          <View style={styles.profileRow}>
            <Image source={{ uri: user.foto }} style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.profileName}>{user.nome}</Text>
              <Text style={styles.profileSub}>{user.email}</Text>
              <Text style={styles.profileSub}>{user.telefone}</Text>
            </View>
            <TouchableOpacity onPress={abrirEditarPerfil} style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.rowInfo}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Nº Conta</Text>
              <Text style={styles.infoValue}>{user.nbt}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Tipo</Text>
              <Text style={styles.infoValue}>{user.tipoConta}</Text>
            </View>
          </View>
        </View>

        {/* Segurança */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Alterar Palavra-passe</Text>
              <Text style={styles.settingSub}>Recomenda-se alterar regularmente.</Text>
            </View>
            <TouchableOpacity onPress={() => setModalSenha(true)} style={styles.actionBtn}>
              <Ionicons name="lock-closed-outline" size={18} color="#fff" />
              <Text style={styles.actionText}>Alterar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>PIN / Biometria</Text>
              <Text style={styles.settingSub}>Usar impressão facial/biométrica para pagamentos.</Text>
            </View>
            <Switch value={useBiometry} onValueChange={toggleBiometry} />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Autenticação 2FA</Text>
              <Text style={styles.settingSub}>Proteção adicional ao iniciar sessão.</Text>
            </View>
            <Switch value={twoFA} onValueChange={toggleTwoFA} />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Dispositivos Conectados</Text>
              <Text style={styles.settingSub}>Gerencie dispositivos com acesso.</Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#2D2A4A" }]}
              onPress={() =>
                Alert.alert(
                  "Dispositivos",
                  devices.map((d) => `${d.name} • Último: ${d.last}`).join("\n\n") || "Nenhum"
                )
              }
            >
              <Ionicons name="phone-portrait-outline" size={18} color="#fff" />
              <Text style={styles.actionText}>Ver</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Métodos de Pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métodos de Pagamento</Text>

          {cards.map((c) => (
            <View key={c.id} style={styles.cardRow}>
              <View>
                <Text style={styles.cardTitle}>
                  {c.brand} • **** {c.last4}
                </Text>
                <Text style={styles.cardSub}>{c.holder} — {c.expiry}</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[styles.smallAction, { backgroundColor: "#2D2A4A" }]}
                  onPress={() => Alert.alert("Editar", "Funcionalidade editar (mock).")}
                >
                  <Ionicons name="create-outline" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallAction, { backgroundColor: "#FF5C63", marginLeft: 8 }]}
                  onPress={() => removerCartao(c.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addCardBtn} onPress={() => setModalAddCard(true)}>
            <Ionicons name="card-outline" size={18} color="#fff" />
            <Text style={styles.addCardText}>Adicionar Cartão</Text>
          </TouchableOpacity>

          <View style={{ height: 10 }} />

          <Text style={[styles.settingSub, { marginBottom: 8 }]}>Contas Bancárias Vinculadas</Text>
          {bankAccounts.map((b) => (
            <View key={b.id} style={styles.cardRow}>
              <View>
                <Text style={styles.cardTitle}>{b.bank}</Text>
                <Text style={styles.cardSub}>Nº: {b.acc}</Text>
              </View>
              <TouchableOpacity
                style={[styles.smallAction, { backgroundColor: "#FF5C63" }]}
                onPress={() => Alert.alert("Remover conta", "Remover conta (mock).")}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Preferências de Transação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências de Transações</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Notificações (Push)</Text>
              <Text style={styles.settingSub}>Receber alertas no dispositivo.</Text>
            </View>
            <Switch value={notifsPush} onValueChange={setNotifsPush} />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Notificações (Email)</Text>
              <Text style={styles.settingSub}>Recibos e alertas por email.</Text>
            </View>
            <Switch value={notifsEmail} onValueChange={setNotifsEmail} />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.settingLabel}>Limite diário de transferências</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
              <TextInput
                value={limiteDiario}
                onChangeText={alterarLimite}
                keyboardType="numeric"
                style={styles.limitInput}
                placeholder="0"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.saveLimitBtn} onPress={handleSalvarLimite}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Personalização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalização</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Tema Escuro</Text>
              <Text style={styles.settingSub}>Mudar aparência do app.</Text>
            </View>
            <Switch value={temaEscuro} onValueChange={toggleTema} />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Idioma</Text>
              <Text style={styles.settingSub}>Selecionar idioma da interface.</Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#2D2A4A" }]}
              onPress={() =>
                Alert.alert("Idioma", "Selecionar idioma (mock): atual " + idioma)
              }
            >
              <Text style={styles.actionTextSmall}>{idioma}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Serviços Vinculados e Suporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços & Suporte</Text>

          <View style={styles.serviceLink}>
            <Ionicons name="bus-outline" size={20} color="#8F80FF" />
            <Text style={styles.serviceTextRow}>Transportes & Bilhetes</Text>
            <TouchableOpacity onPress={() => Alert.alert("Abrir", "Integração transporte (mock).")}>
              <Ionicons name="chevron-forward-outline" size={18} color="#8F80FF" />
            </TouchableOpacity>
          </View>

          <View style={styles.serviceLink}>
            <Ionicons name="logo-whatsapp" size={20} color="#8F80FF" />
            <Text style={styles.serviceTextRow}>Suporte (WhatsApp)</Text>
            <TouchableOpacity onPress={solicitarSuporte}>
              <Ionicons name="chevron-forward-outline" size={18} color="#8F80FF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ações perigosas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <TouchableOpacity
            style={[styles.dangerBtn]}
            onPress={() => Alert.alert("Bloquear Conta", "Conta bloqueada (mock).")}
          >
            <Ionicons name="ban-outline" size={18} color="#FF5C63" />
            <Text style={styles.dangerText}>Bloquear Conta</Text>
          </TouchableOpacity>


        </View>

      </ScrollView>

      {/* Modal Alterar Senha */}
      <Modal visible={modalSenha} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Alterar Palavra-passe</Text>

            <TextInput
              placeholder="Nova palavra-passe"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Confirmar palavra-passe"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={confirmSenha}
              onChangeText={setConfirmSenha}
              style={styles.modalInput}
            />

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity style={[styles.modalAction, { backgroundColor: "#4C44C1" }]} onPress={handleChangePassword}>
                <Text style={styles.modalActionText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalAction, { backgroundColor: "#1F1C2C", marginLeft: 8 }]} onPress={() => setModalSenha(false)}>
                <Text style={styles.modalActionText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Adicionar Cartão */}
      <Modal visible={modalAddCard} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Adicionar Cartão</Text>

            <TextInput
              placeholder="Número do cartão"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="Nome do titular"
              placeholderTextColor="#aaa"
              value={cardName}
              onChangeText={setCardName}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="MM/AA"
              placeholderTextColor="#aaa"
              value={cardExpiry}
              onChangeText={setCardExpiry}
              style={styles.modalInput}
            />

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity style={[styles.modalAction, { backgroundColor: "#4C44C1" }]} onPress={handleAddCard}>
                <Text style={styles.modalActionText}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalAction, { backgroundColor: "#1F1C2C", marginLeft: 8 }]} onPress={() => setModalAddCard(false)}>
                <Text style={styles.modalActionText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* --- Estilos --- */
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
    borderBottomColor: "#8F80FF",
  },
  backButton: { backgroundColor: "#8F80FF", padding: 8, borderRadius: 10 },
  iconButton: { backgroundColor: "#8F80FF", padding: 8, borderRadius: 10 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  section: {
    marginHorizontal: 18,
    backgroundColor: "#031D34",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  profileRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 62, height: 62, borderRadius: 32, backgroundColor: "#fff" },
  profileName: { color: "#fff", fontSize: 16, fontWeight: "800" },
  profileSub: { color: "#8F80FF", fontSize: 12, marginTop: 4 },

  rowInfo: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  infoBox: { flex: 1, marginRight: 8, backgroundColor: "#06243B", padding: 10, borderRadius: 10 },
  infoLabel: { color: "#8F80FF", fontSize: 12, fontWeight: "700" },
  infoValue: { color: "#fff", marginTop: 6, fontWeight: "700" },

  sectionTitle: { color: "#8F80FF", fontSize: 15, fontWeight: "700", marginBottom: 10 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  settingLabel: { color: "#fff", fontWeight: "700" },
  settingSub: { color: "#dfe6ff", fontSize: 12, marginTop: 4 },

  actionBtn: {
    backgroundColor: "#4C44C1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
  actionTextSmall: { color: "#fff", marginLeft: 6, fontWeight: "700" },

  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  cardTitle: { color: "#fff", fontWeight: "800" },
  cardSub: { color: "#8F80FF", fontSize: 12 },

  smallAction: { padding: 8, borderRadius: 8 },

  addCardBtn: {
    marginTop: 8,
    backgroundColor: "#1F1C2C",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  addCardText: { color: "#fff", marginLeft: 8, fontWeight: "700" },

  limitInput: {
    backgroundColor: "#06243B",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    color: "#fff",
    flex: 1,
    marginRight: 8,
  },
  saveLimitBtn: {
    backgroundColor: "#4C44C1",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  serviceLink: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  serviceTextRow: { color: "#fff", flex: 1, marginLeft: 10 },

  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  dangerText: { color: "#FF5C63", marginLeft: 10, fontWeight: "700" },

  logoutBtn: {
    marginTop: 12,
    backgroundColor: "#FF6B00",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "800" },

  /* Modal */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  modalCard: { backgroundColor: "#031D34", width: "100%", borderRadius: 16, padding: 18 },
  modalTitle: { color: "#8F80FF", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  modalInput: { backgroundColor: "#06243B", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, color: "#fff", marginBottom: 10 },
  modalAction: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  modalActionText: { color: "#fff", fontWeight: "700" },
});
