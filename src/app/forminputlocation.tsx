import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import * as Location from 'expo-location';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";


const App = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [accuration, setAccuration] = useState('');
    const [loading, setLoading] = useState(false);

    const createOneButtonAlert = () =>
        Alert.alert('Success', 'Berhasil menambahkan data', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);


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

    // Get current location
    const getCoordinates = async () => {
        try {
            setLoading(true);


            // 1. Cek apakah layanan GPS / lokasi aktif di perangkat
            const isServicesEnabled = await Location.hasServicesEnabledAsync();
            if (!isServicesEnabled) {
                if (Platform.OS === 'android') {
                    try {
                        await Location.enableNetworkProviderAsync();
                    } catch {
                        Alert.alert(
                            'Layanan Lokasi Nonaktif',
                            'Silakan aktifkan GPS / layanan lokasi di pengaturan perangkat Anda untuk melanjutkan.'
                        );
                        return;
                    }
                } else {
                    Alert.alert(
                        'Layanan Lokasi Nonaktif',
                        'Silakan aktifkan GPS / layanan lokasi di pengaturan perangkat Anda untuk melanjutkan.'
                    );
                    return;
                }
            }


            // 2. Minta izin akses lokasi foreground
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Izin Ditolak',
                    'Aplikasi memerlukan izin untuk mengakses lokasi perangkat.'
                );
                return;
            }


            // 3. Ambil posisi saat ini
            let currentLocation: Location.LocationObject | null = null;
            try {
                currentLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
            } catch (posError) {
                console.warn('Gagal mendapatkan posisi realtime, mencoba posisi terakhir:', posError);
                // Fallback jika getCurrentPosition gagal/timeout (misal pada emulator atau sinyal GPS lemah)
                currentLocation = await Location.getLastKnownPositionAsync({});
            }


            if (!currentLocation) {
                Alert.alert(
                    'Gagal Mendapatkan Lokasi',
                    'Tidak dapat menentukan lokasi saat ini. Pastikan GPS aktif dan coba beberapa saat lagi.'
                );
                return;
            }


            const coords = `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
            setLocation(coords);


            const accuracy = currentLocation.coords.accuracy;
            setAccuration(accuracy != null ? `${accuracy.toFixed(1)} m` : '-');
        } catch (error: any) {
            console.error('Error saat mengambil koordinat:', error);
            Alert.alert(
                'Error Lokasi',
                error?.message || 'Terjadi kesalahan saat mengambil koordinat lokasi.'
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaProvider style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack.Screen options={{ title: 'Form Input Location' }} />
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                    <Text style={styles.inputTitle}>Nama</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Isikan nama objek"
                        value={name}
                        onChangeText={setName}
                    />
                    <Text style={styles.inputTitle}>Deskripsi</Text>
                    <TextInput
                        editable
                        multiline
                        numberOfLines={4}
                        style={styles.textInput}
                        placeholder="Isikan deskripsi objek"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <Text style={styles.inputTitle}>Koordinat</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Isikan koordinat (contoh: -6.200000,106.816666)"
                        value={location}
                        onChangeText={setLocation}
                    />
                    <Text style={styles.inputTitle}>Accuration</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Isikan accuration (contoh: 5 meter)"
                        value={accuration}
                        onChangeText={setAccuration}
                    />
                    <View style={styles.button}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />
                        ) : (
                            <Button
                                title="Get Current Location"
                                onPress={getCoordinates}
                                disabled={loading}
                            />
                        )}
                    </View>
                    <View style={styles.button}>
                        <Button
                            title="Save"
                            onPress={() => {
                                const locationsRef = ref(db, 'points/');
                                push(locationsRef, {
                                    name: name,
                                    description: description,
                                    coordinates: location,
                                    accuration: accuration,
                                }).then(() => {
                                    createOneButtonAlert();
                                    console.log("Berhasil menyimpan data ", locationsRef.key);
                                    // clear form
                                    setName('');
                                    setLocation('');
                                    setAccuration('');
                                }).catch((e) => {
                                    console.error("Error adding document: ", e);
                                    Alert.alert("Error", "Gagal menyimpan data");
                                });
                            }}

                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};


const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 24,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    textInput: {
        padding: 10,
        borderWidth: 1,
        margin: 12,
        borderRadius: 5,
        height: 100,
        textAlignVertical: "top",
    },
    inputTitle: {
        marginLeft: 12,
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
    },
    button: {
        margin: 12,
    },
    loader: {
        paddingVertical: 8,
    },
});


export default App;
