import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function KZPayAboutPage() {
  const router = useRouter();
  
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);


  const abrirWhatsApp = () => {
    const phone = "+244912345678"; // número real aqui
    const text = encodeURIComponent("Olá, tenho uma pergunta sobre o KZPay.");
    Linking.openURL(`https://wa.me/${phone.replace(/\D/g, "")}?text=${text}`).catch(() =>
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.")
    );
  };

  return (
    <View style={styles.safeArea}>
      {/* Cabeçalho fixo */}
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre • KZPay</Text>
        <TouchableOpacity
        onPress={abrirWhatsApp}
          style={styles.iconButton}
          accessibilityLabel="Contactar KZPay"
        >
          <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>


      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Hero */}

        
        <LinearGradient colors={["#8F80FF", "#4C44C1"]} style={styles.heroCard}>
            <View style={styles.logoContainer}>
                    <Image
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/6269/6269947.png",
                      }}
                      style={styles.logo}
                    />
                 
          </View>
          <Text style={styles.heroTitle}>KZPay — Pagamentos simples, rápidos e seguros</Text>
          <Text style={styles.heroSubtitle}>
            Revolucionamos a forma de pagar em Angola — para comerciantes, clientes e serviços.
          </Text>

          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.heroBtn} onPress={() => router.push("/cliente/pagar")}>
              <Ionicons name="card-outline" size={18} color="#fff" />
              <Text style={styles.heroBtnText}>Fazer Pagamento</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.heroBtnOutline}  onPress={abrirWhatsApp}>
              <Ionicons name="logo-whatsapp" size={18} color="#8F80FF" />
              <Text style={styles.heroBtnOutlineText}>Contacte-nos</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quem somos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quem somos</Text>
          <Text style={styles.sectionText}>
            O KZPay é uma plataforma de pagamentos construída em Angola pela empresa de Tecnologia Luxon Technologies para facilitar transacções diárias.
            Unimos tecnologia, segurança e acessibilidade para permitir que comerciantes e clientes
            façam pagamentos com rapidez e confiança.
          </Text>

          <View style={styles.featuresRow}>
            <View style={styles.featureCard}>
              <Ionicons name="people-outline" size={28} color="#8F80FF" />
              <Text style={styles.featureTitle}>Centrada nas Pessoas</Text>
              <Text style={styles.featureText}>Fácil de usar para qualquer nível de utilizador.</Text>
            </View>

            <View style={styles.featureCard}>
              <Ionicons name="speedometer-outline" size={28} color="#8F80FF" />
              <Text style={styles.featureTitle}>Rápido</Text>
              <Text style={styles.featureText}>Processamento de pagamentos em segundos.</Text>
            </View>
          </View>
        </View>

        {/* Objectivos */}
        <View style={[styles.section, { paddingBottom: 6 }]}>
          <Text style={styles.sectionTitle}>Objectivos</Text>
          <View style={styles.objectiveRow}>
            <Ionicons name="target-outline" size={22} color="#8F80FF" />
            <Text style={styles.objectiveText}>Promover inclusão financeira em Angola.</Text>
          </View>
          <View style={styles.objectiveRow}>
            <Ionicons name="layers-outline" size={22} color="#8F80FF" />
            <Text style={styles.objectiveText}>Oferecer APIs e ferramentas para negócios crescerem.</Text>
          </View>
          <View style={styles.objectiveRow}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#8F80FF" />
            <Text style={styles.objectiveText}>Garantir segurança e privacidade dos utilizadores.</Text>
          </View>
        </View>

        {/* Serviços */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços</Text>

          <View style={styles.serviceCard}>
            <Ionicons name="cash-outline" size={26} color="#fff" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.serviceTitle}>Pagamentos via QR / KZPay</Text>
              <Text style={styles.serviceText}>
                Pague fornecedores, transporte ou serviços rapidamente com um QR ou referência.
              </Text>
            </View>
          </View>

          <View style={styles.serviceCardAlt}>
            <Ionicons name="cloud-upload-outline" size={26} color="#4C44C1" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.serviceTitle}>Integração para Comércio</Text>
              <Text style={styles.serviceText}>
                APIs para lojas online e terminais físicos. Simplificamos a integração.
              </Text>
            </View>
          </View>

          <View style={styles.serviceCard}>
            <Ionicons name="shield-outline" size={26} color="#fff" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.serviceTitle}>Proteção e Conformidade</Text>
              <Text style={styles.serviceText}>
                Encriptação, monitorização e políticas que cumprem padrões de segurança.
              </Text>
            </View>
          </View>
        </View>

        {/* Como funciona */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como funciona</Text>

          <View style={styles.howRow}>
            <View style={styles.howStep}>
              <View style={styles.howIcon}>
                <Ionicons name="scan-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.howTitle}>Ler QR</Text>
              <Text style={styles.howText}>Aponte a câmara ao QR ou insira a referência KZPay.</Text>
            </View>

            <View style={styles.howStep}>
              <View style={styles.howIcon}>
                <Ionicons name="card-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.howTitle}>Confirmar</Text>
              <Text style={styles.howText}>Verifique os detalhes e confirme com a senha.</Text>
            </View>

            <View style={styles.howStep}>
              <View style={styles.howIcon}>
                <Ionicons name="checkmark-done-outline" size={20} color="#fff" />
              </View>
              <Text style={styles.howTitle}>Conclusão</Text>
              <Text style={styles.howText}>Pagamento processado — recibo imediato.</Text>
            </View>
          </View>
        </View>

        {/* Segurança */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança</Text>
          <Text style={styles.sectionText}>
            A segurança está no centro do KZPay. Utilizamos encriptação, autenticação forte e
            monitorização de transacções para proteger os fundos dos utilizadores.
          </Text>

          <View style={styles.securityRow}>
            <View style={styles.securityItem}>
              <Ionicons name="lock-closed-outline" size={22} color="#8F80FF" />
              <Text style={styles.securityText}>Encriptação ponta-a-ponta</Text>
            </View>
            <View style={styles.securityItem}>
              <Ionicons name="finger-print-outline" size={22} color="#8F80FF" />
              <Text style={styles.securityText}>Autenticação biométrica</Text>
            </View>
          </View>
        </View>

{/* Política de Privacidade - KZPay */}
<View style={styles.privacyContainer}>
  <View style={[styles.modalCard, { height: "auto" }]}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.modalTitle}>Política de Privacidade • KZPay</Text>

      <Text style={styles.policyText}>
        Esta Política descreve como o KZPay recolhe, utiliza e protege as informações pessoais
        dos seus utilizadores, conforme as normas do Banco Nacional de Angola e a Lei n.º 22/11
        de Proteção de Dados Pessoais.
      </Text>

      <Text style={styles.policySubTitle}>1. Recolha de Dados</Text>
      <Text style={styles.policyText}>
        O KZPay recolhe apenas as informações necessárias para fornecer os seus serviços,
        incluindo dados de identificação (nome, telefone, e-mail, número da conta, NIF)
        e dados de transações. Nenhum dado sensível é partilhado sem o consentimento expresso
        do utilizador.
      </Text>

      <Text style={styles.policySubTitle}>2. Utilização de Informações</Text>
      <Text style={styles.policyText}>
        As informações são utilizadas exclusivamente para: processar pagamentos, verificar
        identidade, melhorar os serviços e cumprir obrigações legais e regulatórias.
      </Text>

      <Text style={styles.policySubTitle}>3. Segurança dos Dados</Text>
      <Text style={styles.policyText}>
        O KZPay implementa criptografia, autenticação multifatorial e políticas de acesso restrito.
        Todos os dados são armazenados em servidores seguros e auditados periodicamente.
      </Text>

      <Text style={styles.policySubTitle}>4. Partilha de Dados</Text>
      <Text style={styles.policyText}>
        O KZPay não vende nem aluga informações pessoais. Dados podem ser partilhados apenas
        com autoridades financeiras ou parceiros autorizados, quando exigido por lei.
      </Text>

      <Text style={styles.policySubTitle}>5. Direitos do Utilizador</Text>
      <Text style={styles.policyText}>
        O utilizador pode solicitar acesso, correção ou eliminação dos seus dados pessoais
        a qualquer momento através dos nossos canais oficiais de atendimento.
      </Text>

      <Text style={styles.policySubTitle}>6. Cookies e Rastreamento</Text>
      <Text style={styles.policyText}>
        O aplicativo pode utilizar cookies ou identificadores únicos para personalizar a
        experiência e garantir segurança nas sessões.
      </Text>

      <Text style={styles.policySubTitle}>7. Alterações</Text>
      <Text style={styles.policyText}>
        O KZPay reserva-se o direito de atualizar esta política conforme evoluam as normas
        financeiras e tecnológicas. A versão mais recente estará sempre disponível no aplicativo.
      </Text>

      <Text style={styles.policyText}>
        Para mais informações, contacte-nos através de{" "}
        <Text style={{ color: "#8F80FF", fontWeight: "700" }}>suporte@kzpay.co.ao</Text>.
      </Text>
    </ScrollView>
  </View>
</View>

        {/* Contato / CTA */}
        <View style={[styles.section, styles.ctaSection]}>
          <Text style={styles.ctaTitle}>Precisa de ajuda?</Text>
          <Text style={styles.ctaSubtitle}>Fale connosco a qualquer momento.</Text>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            <TouchableOpacity style={styles.ctaBtnOutline} onPress={abrirWhatsApp}>
              <Ionicons name="logo-whatsapp" size={18} color="#4C44C1" />
              <Text style={styles.ctaBtnOutlineText}>Suporte (WhatsApp)</Text>
            </TouchableOpacity>
            
          </View>


            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            <TouchableOpacity style={styles.ctaBtnOutlineLuxon} >
             
              <Text style={styles.ctaBtnOutlineTextLuxon}>Powered BY Luxon Tecnology</Text>
            </TouchableOpacity>
            
          </View>
        </View>
        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} KZPay · Todos os direitos reservados</Text>
         
          <Text style={styles.footerSmall}>Termos • Privacidade • Ajuda</Text>
          
        </View>
      </ScrollView>

     
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logo: { width: 90, height: 90, marginBottom: 10 },
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
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "700" },

  heroCard: { margin: 18, borderRadius: 16, padding: 18, elevation: 6 },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  heroSubtitle: { color: "#e8e8ff", marginTop: 6, fontSize: 13 },
  heroActions: { flexDirection: "row", marginTop: 14, gap: 10 },
  heroBtn: {
    flexDirection: "row",
    backgroundColor: "#1F1C2C",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  heroBtnText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
  heroBtnOutline: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#8F80FF",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  heroBtnOutlineText: { color: "#8F80FF", marginLeft: 8, fontWeight: "700" },

  section: {
    marginHorizontal: 18,
    backgroundColor: "#031D34",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: { color: "#8F80FF", fontSize: 16, fontWeight: "700", marginBottom: 8 },
  sectionText: { color: "#fff", fontSize: 14, lineHeight: 20 },
  featuresRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  featureCard: {
    backgroundColor: "#06243B",
    padding: 12,
    borderRadius: 12,
    width: "48%",
  },
  featureTitle: { color: "#fff", fontWeight: "700", marginTop: 8 },
  featureText: { color: "#cfcff0", marginTop: 4, fontSize: 12 },
  objectiveRow: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 8 },
  objectiveText: { color: "#fff", marginLeft: 10 },

  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4C44C1",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  serviceCardAlt: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#06243B",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  serviceTitle: { color: "#fff", fontWeight: "700" },
  serviceText: { color: "#e8e8ff", marginTop: 4, fontSize: 13 },

  howRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  howStep: { width: "31%", alignItems: "center" },
  howIcon: { backgroundColor: "#8F80FF", padding: 10, borderRadius: 12, marginBottom: 8 },
  howTitle: { color: "#fff", fontWeight: "700" },
  howText: { color: "#dfe6ff", fontSize: 12, textAlign: "center", marginTop: 6 },

  securityRow: { flexDirection: "row", marginTop: 12, gap: 10 },
  securityItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  securityText: { color: "#fff", marginLeft: 8 },

  ctaSection: { alignItems: "center", justifyContent: "center" },
  ctaTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  ctaSubtitle: { color: "#dfe6ff", marginTop: 6, fontSize: 13 },
  ctaBtnOutline: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#4C44C1",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
   ctaBtnOutlineLuxon: {
    flexDirection: "row",
    borderWidth: 0,
    borderColor: "#4C44C1",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaBtnOutlineText: { color: "#4C44C1", marginLeft: 8, fontWeight: "700" },
ctaBtnOutlineTextLuxon: { color: "#ffff", marginLeft: 8, fontWeight: "700" },

  footer: { alignItems: "center", marginTop: 10, marginBottom: 20 },
  footerText: { color: "#8F80FF", fontWeight: "700" },
  footerSmall: { color: "#7d8aa3", fontSize: 12, marginTop: 4 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: { backgroundColor: "#031D34", width: "100%", borderRadius: 16, padding: 18 },
  modalTitle: { color: "#8F80FF", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: {
    backgroundColor: "#06243B",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    marginBottom: 10,
  },
  modalBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 5,
  },
  modalBtnText: { color: "#fff", fontWeight: "700", marginLeft: 8 },
  privacyContainer: {
  backgroundColor: "#031D34",
  padding: 15,
  borderRadius: 20,
  marginTop: 20,
  marginBottom: 40,
  width: "90%",
  alignSelf: "center",
},

policySubTitle: {
  color: "#8F80FF",
  fontWeight: "700",
  fontSize: 15,
  marginTop: 12,
  marginBottom: 6,
},
policyText: {
  color: "#fff",
  fontSize: 13,
  lineHeight: 20,
  marginBottom: 4,
  textAlign: "justify",
},

});
