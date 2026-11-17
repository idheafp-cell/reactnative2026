import { StyleSheet, Text, View, SectionList, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6"; 

const DATA = [
    {
        "title": "Asisten",
        "data": ["Asbil", "Budi", "Charlie", "David"]
    },
    {
        "title": "Mahasiswa Kelas A",
        "data": ["Cindy", "Dina", "Evi", "Fani", "Gina",
            "Hani", "Ika", "Jeni", "Kiko"]
    },
    {
        "title": "Mahasiswa Kelas B",
        "data": ["Dono", "Kasino", "Indro", "Toto", "Joko",
            "Budi", "Charlie", "David", "Eko"]
    }
];

const App = () => (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>
                            <FontAwesome6 name="user" iconStyle='solid' /> {item}
                        </Text>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
            />
        </SafeAreaView>
    </SafeAreaProvider>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
    },
    header: {
        fontSize: 32,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
    },
});

export default App;