// ProjectsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { getProjects } from './lib/gestionesAPI';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      // La API podría devolver {data: [...]} o directamente [...]
      const list = Array.isArray(data) ? data : (data?.data || data?.projects || []);
      setProjects(list);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando proyectos…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={(item, idx) => String(item?.id ?? idx)}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item?.nombre ?? 'Proyecto'}</Text>
          {item?.descripcion ? <Text style={styles.desc}>{item.descripcion}</Text> : null}
          <Text style={styles.meta}>
            {`Tipo: ${item?.tipo ?? '-'} · Estado: ${item?.estado ?? '-'}`}
          </Text>
        </View>
      )}
      ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Sin proyectos</Text>}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 3 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  desc: { color: '#444', marginBottom: 6 },
  meta: { color: '#666' },
});
