import {useState} from 'react';
import {StyleSheet, TextInput, Text, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TextInputExample = () => {
  const [text, onChangeText] = useState('Useless Text');
  const [number, onChangeNumber] = useState('');

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text style={styles.labelinput}>Grup</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Isikan grup"
        />
        <Text style={styles.labelinput}>NIM</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder="Isikan NIM"
        />
        <Button title="Simpan"/>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  labelinput: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    marginBottom: 8,
  },
});

export default TextInputExample;