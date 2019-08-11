import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, KeyboardAvoidingView , Platform , StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png'

export default function Login({ navigation }){
    const [ developer, setDeveloper ] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('developer').then( developer => {
            if(developer){
                navigation.navigate('Main', {developer});
            }    
        })
    }, []);

    async function handleLogin(){
        const response = await api.post('/add',{ username: developer });

        const id = response.data._id;
        await AsyncStorage.setItem('developer', id);
        navigation.navigate('Main', {developer: id});
    }

    return ( 
        <KeyboardAvoidingView 
            behavior="padding"
            enabled={Platform.os === 'ios'}   
            style={styles.container} 
        >
            <Image source={logo} />
            <TextInput 
                value={developer}
                onChangeText={setDeveloper}
                autoCapitalize='none'
                autoCorrect={false}
                placeholder="Digite seu usuario do Github"
                placeholderTextColor="#999" 
                style={styles.input} 
            />

            <TouchableOpacity onPress={handleLogin} style={styles.button} >
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },

    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#df4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'

    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});