import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity } from 'react-native';

import api from '../services/api'

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';


const IMG = 'https://avatars3.githubusercontent.com/u/17505605?s=400&u=db53fe7a02f86098083d64d14ca233d29697498f&v=4';
const BIO = 'Student of Computer Engineering at the Federal University of Ceará - Brazil, Sobral Campus.';
export default function Main({ navigation }){
    const [developers, setDevelopers] = useState([]);
    const id = navigation.getParam('developer');

    useEffect(() => {
        async function loadDevelopers(){
            const response = await api.get('all', {
                headers: { id: id }
            });

            setDevelopers(response.data);
        }

        loadDevelopers();
    }, [id]);

    async function handleLike(){
        const [ developer, ...rest ] = developers;

        await api.post(`${developers._id}/like`,null, {
            headers: { id: id }
        });

        setDevelopers(rest);
    }

    async function handleDislike(){
        const [ developer, ...rest ] = developers;

        await api.post(`${developer._id}/dislike`,null, {
            headers: { id: id }
        });

        setDevelopers(rest);
    }

    async function handleLogout(){
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>
            <View style={styles.cardContainer}>
                { developers.length === 0 
                ? <Text style={styles.empty}>Acabou</Text>
                :
                (
                    developers.map((developer,index) => (
                        <View key={developer._id} style={[styles.card, {zIndex: developers.length - index}]}>
                            <Image style={styles.avatar} source={{uri: developer.avatar }}/>
                            <View style={styles.footer}>
                                <Text style={styles.name}>{developer.name}</Text>
                                <Text numberOfLines={3} style={styles.bio}>{developer.bio}</Text>
                            </View>
                        </View>
                    ))
                )
                }
            </View>
            { developers.length > 0 && (
                <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={handleDislike} style={styles.button}>
                    <Image source={dislike}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLike} style={styles.button}>
                    <Image source={like}/>
                </TouchableOpacity>
            </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    logo: {
        marginTop: 30
    },

    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    cardContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500
    },

    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },

    avatar: {
        flex: 1,
        height: 300
    },

    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
        lineHeight: 18
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30
    }, 

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },

    empty: {
        alignSelf: 'center',
        color: '#777',
        fontSize: 24,
        fontWeight: 'bold'
    }
});