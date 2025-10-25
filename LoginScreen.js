// LoginScreen.js
import React, { useState, useCallback, memo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { login } from './lib/gestionesAPI';

const InputField = memo(({
  label, value, onChangeText, placeholder, secureTextEntry = false,
  showPassword = false, onTogglePassword, required = false,
  icon = "text", keyboardType = "default"
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      {label} {required && <Text style={styles.required}>*</Text>}
    </Text>
    <View style={styles.inputContainer}>
      <Ionicons name={getIconName(icon)} size={20} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        keyboardType={keyboardType}
        autoCapitalize="none"
        blurOnSubmit={false}
      />
      {secureTextEntry && (
        <TouchableOpacity style={styles.eyeIcon} onPress={onTogglePassword}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} />
        </TouchableOpacity>
      )}
    </View>
  </View>
));

export default function LoginScreen({ navigation }) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLoginChange = useCallback((field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleLogin = async () => {
    const { email, password } = loginData;
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Ingresa correo y contraseña');
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), password);
      navigation.replace('Proyectos'); // va directo a la lista
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Credenciales inválidas o servidor no disponible');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}><Text style={styles.logo}>GestiónPro</Text></View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <InputField
            label="Correo Electrónico"
            value={loginData.email}
            onChangeText={(v) => handleLoginChange('email', v)}
            placeholder="tu@email.com"
            icon="mail-outline"
            keyboardType="email-address"
            required
          />
          <InputField
            label="Contraseña"
            value={loginData.password}
            onChangeText={(v) => handleLoginChange('password', v)}
            placeholder="Tu contraseña"
            secureTextEntry
            showPassword={showLoginPassword}
            onTogglePassword={() => setShowLoginPassword(!showLoginPassword)}
            icon="lock-closed-outline"
            required
          />

          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>{loading ? 'Ingresando...' : 'Entrar'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// helpers + estilos (mantengo tu estética)
const getIconName = (iconType) => {
  const icons = {
    'text': 'text-outline',
    'mail': 'mail-outline',
    'mail-outline': 'mail-outline',
    'lock': 'lock-closed-outline',
    'lock-closed-outline': 'lock-closed-outline',
    'person': 'person-outline',
    'person-outline': 'person-outline'
  };
  return icons[iconType] || 'text-outline';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  logo: { fontSize: 32, fontWeight: 'bold' },
  formContainer: { backgroundColor: 'white', borderRadius: 12, padding: 24, elevation: 6 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  required: { color: '#f72585' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 12 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 15 },
  eyeIcon: { padding: 6 },
  actionButton: { borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryButton: { backgroundColor: '#4361ee' },
  actionButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
