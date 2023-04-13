import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useEffect, useState } from 'react';

import { Text, View } from '../../components/Themed';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import { countryByBarcode } from '../../utils/countryByBarcode';

export default function TabCountryScreen() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const getBarcodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarcodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeEvent) => {
    console.log(type, data);
    setScanned(true);
    setValue(data);
  };

  if (hasPermission === null) {
    return null;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No access to camera</Text>;
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {!scanned ? (
        <>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            barCodeTypes={[
              BarCodeScanner.Constants.BarCodeType.ean13,
              BarCodeScanner.Constants.BarCodeType.ean8,
              BarCodeScanner.Constants.BarCodeType.upc_a,
              BarCodeScanner.Constants.BarCodeType.upc_e,
              BarCodeScanner.Constants.BarCodeType.upc_ean,
            ]}
          />
        </>
      ) : (
        <>
          <View style={styles.container}>
            {/* <Text>{value}</Text> */}
            {value != undefined ? (
              <>
                <Text>Country of origin:</Text>
                <Text style={styles.title}>{countryByBarcode(value)}</Text>
              </>
            ) : null}
          </View>
          <Button
            title={'Tap to Scan Again'}
            onPress={() => setScanned(false)}
          />
          <View
            style={{
              ...styles.separator,
              marginVertical: 10,
              height: 0,
            }}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
