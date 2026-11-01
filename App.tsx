import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { HeroAvatarHUD } from './src/components/HeroAvatarHUD';
import { StatsControlPanel } from './src/components/StatsControlPanel';
import { ArmoryGrid } from './src/components/ArmoryGrid';
import { ReduxLiveInspector } from './src/components/ReduxLiveInspector';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#030712" />

        {/* Encabezado RPG Superior */}
        <View style={styles.appHeader}>
          <Text style={styles.appTitle}>⚔️ HEROFORGE RPG</Text>
          <Text style={styles.appSubtitle}>
            ARQUITECTURA DE ESTADO VISUAL CON REDUX TOOLKIT
          </Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionBadgeText}>
              ESTADO GLOBAL REACTIVO • 4 ZONAS HERMANAS
            </Text>
          </View>
        </View>

        {/* Contenedor con Scroll de las 4 Zonas Visuales Independientes */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ZONA A: Avatar & HUD Superior (Componente hermano sin props) */}
          <HeroAvatarHUD />

          {/* ZONA B: Panel de Entrenamiento de Atributos (Componente hermano sin props) */}
          <StatsControlPanel />

          {/* ZONA C: Armería & Mochila (Componente hermano sin props) */}
          <ArmoryGrid />

          {/* ZONA D: Arena de Combate & Inspector Redux en Vivo (Componente hermano sin props) */}
          <ReduxLiveInspector />
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#030712',
  },
  appHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#030712',
    borderBottomWidth: 1.5,
    borderBottomColor: '#1f2937',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#f9fafb',
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  versionBadge: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  versionBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
});
