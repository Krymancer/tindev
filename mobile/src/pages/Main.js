import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

import api from '../services/api'

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png'


export default function Main({ navigation }){
    const [developers, setDevelopers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);
    console.log('deve len', developers.length);
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

    useEffect(() => {
        const socket = io('http://tindev-backstage.herokuapp.com/', {
            query: { developer: id }
        });

        socket.on('match', developer => {
            setMatchDev(developer);
        });

    },  [id]);

    async function handleLike(){
        const [ developer, ...rest ] = developers;

        await api.post(`${developer._id}/like`,null, {
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
            <StatusBar backgroundColor='#df4723' barStyle='light-content' />
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>
            <View style={styles.cardContainer}>
                { developers.length === 0 
                ? <Text style={styles.empty}>Acabou</Text>
                : (
                    developers.map((developer,index) => (
                        <View key={developer._id} style={[styles.card, {zIndex: developers.length - index}]}>
                            <Image style={styles.avatar} source={{uri: developer.avatar }}/>
                            <View style={styles.footer}>
                                <Text style={styles.name}>{developer.name}</Text>
                                <Text numberOfLines={3} style={styles.bio}>{developer.bio}</Text>
                            </View>
                        </View>
                    ))
                )}
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

            { (matchDev) && 
                <View style={[styles.matchContainer , {zIndex: 999999e99}]}>
                    <Image source={itsamatch} style={styles.matchImage} />
                    <Image style={styles.matchAvatar} source={{uri: matchDev.avatar}}/>

                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    
                    <TouchableOpacity onPress={() => {setMatchDev(null)}}>
                        <Text style={styles.closeMatch }>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            }
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
        marginBottom: 30,
        zIndex: 1
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
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'

    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF'
    },

    matchImage: {
        height: 60,
        resizeMode: 'contain'
    },

    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },

    closeMatch: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    }
});