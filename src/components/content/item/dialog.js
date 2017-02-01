import React, {Component} from 'react';

import {
    View,
    Text,
    StyleSheet,
    Picker
} from 'react-native';

import {
    Dialog,
    DialogDefaultActions
} from 'react-native-material-ui';

const styles = StyleSheet.create ({
    dialog: {
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

styles.actions = StyleSheet.create ({
    actionsContainer: {
        marginBottom: 20
    }
});

const availableTags = (tags, selected) =>
    tags.edges.filter (
        ({node: tag}) => !selected.edges.find (
            ({node}) => node.id === tag.id
        )
    )

export default class AddTagDialog extends Component {
    constructor (props) {
        super (props);

        this.state = {};
    }

    dismiss () {
        this.props.onDismiss ();
    }

    add () {
        const {tags, item} = this.props;
        const options = availableTags (tags, item.tags);

        this.props.onAdd (
            this.state.selected || options [0].node.id
        );
    }

    render () {
        const {item, tags, open} = this.props;
        const {selected} = this.state;

        const options = availableTags (tags, item.tags);

        return open ? (
            <View style={styles.dialog}>
                <Dialog>
                    <Dialog.Title>
                        <Text>Add Tag</Text>
                    </Dialog.Title>
                    <Dialog.Content>
                        <Picker
                            selectedValue={selected}
                            onValueChange={(selected) => this.setState ({selected})}>

                            {options.map (({node}) => (
                                <Picker.Item
                                    key={node.id}
                                    label={node.name || ''}
                                    value={node.id} />
                            ))}
                        </Picker>
                    </Dialog.Content>

                    <Dialog.Actions
                        style={styles.actions}>
                        <DialogDefaultActions
                            actions={['dismiss', 'add']}
                            onActionPress={(action) => this [action] ()}/>
                    </Dialog.Actions>
                </Dialog>
            </View>
        ) : null;
    }
}
