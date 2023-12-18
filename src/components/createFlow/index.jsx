import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { navigationRef } from '@/router/navigation';

export class BackBtn extends Component {
    handleBackBtnPress = () => {
        navigationRef.current?.goBack();
    }

    render() {
        return (
            <TouchableOpacity style={styles.backBtn} onPress={this.handleBackBtnPress}>
                <Text>{"<"}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    backBtn: {
        position: 'absolute',
        top: 10,  // Adjust as needed
        left: 10, // Adjust as needed
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    }
});

export default BackBtn;
