import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, SectionList, ActivityIndicator, RefreshControl } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyASOHqQBbGbo6rE7Kru2JeHRWDpJnjjIWk",
    authDomain: "pgpbl2026-ca12c.firebaseapp.com",
    databaseURL: "https://pgpbl2026-ca12c-default-rtdb.firebaseio.com",
    projectId: "pgpbl2026-ca12c",
    storageBucket: "pgpbl2026-ca12c.firebasestorage.app",
    messagingSenderId: "952375362848",
    appId: "1:952375362848:web:1aaca8ea8985727a1a0345"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


export default function LokasiScreen() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        const pointsRef = ref(db, 'points/');


        // Listen for data changes
        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Transform the Firebase object into an array
                const pointsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));


                // Format for SectionList
                const formattedData = [{
                    title: 'Lokasi Tersimpan',
                    data: pointsArray
                }];
                setSections(formattedData);
            } else {
                setSections([]);
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });


        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Since Firebase provides real-time data, we can simulate a refresh
        // for UX purposes. A real data refetch isn't strictly necessary unless
        // you want to force a re-read from the server.
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);


    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }


    return (
        <View style={styles.container}>
            {sections.length > 0 ? (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                            <ThemedText style={styles.itemData}>{item.description}</ThemedText>
                            <ThemedText style={styles.itemData}>{item.coordinates}</ThemedText>
                        </View>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <ThemedText style={styles.header}>{title}</ThemedText>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
                <ThemedView style={styles.container}>
                    <ThemedText>Tidak ada data lokasi tersimpan.</ThemedText>
                </ThemedView>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        paddingTop: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff7ecff',
    },
    item: {
        backgroundColor: 'rgb(107, 165, 252)',
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 50,
        borderRadius: 8,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000ff',
    },
    itemData: {
        fontSize: 14,
        color: '#000000ff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#676767ff',
        color: '#ffffffff',
        padding: 16,
    },
});
