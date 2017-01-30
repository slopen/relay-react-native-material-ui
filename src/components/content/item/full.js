import React, {Component} from 'react'
import Relay from 'react-relay';

import {
	withRouter
} from 'react-router-native';

import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Picker,
	ScrollView,
	TouchableHighlight,
	Dimensions
} from 'react-native';


import ViewerQuery from '../../../queries/viewer-query';
import {createRenderer} from '../../../lib/relay-utils';

import RelayStore from '../../../store';

import TagPreview from '../tag/linked';

import UpdateItemMutation from '../../../mutations/item/update';
import LinkMutation from '../../../mutations/link';
import UnlinkMutation from '../../../mutations/unlink';

import {Card, Button, Dialog, DialogDefaultActions} from 'react-native-material-ui';

const styles = StyleSheet.create ({
	container: {
		padding: 3
	},
	header: {
		paddingTop: 40,
		paddingLeft: 10,
		paddingBottom: 40,
		fontSize: 30,
		fontWeight: 'bold'
	},
	input: {
		height: 70,
		fontSize: 20,
		color: '#777',
		padding: 20
	},
	controls: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 12,
	},
	dialog: {
        flex: 1,
        top: 0,
		left: 0,
		right: 0,
		bottom: 0,
        position: 'absolute',
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
	}
})

const buttonStyle = {
	container: {
		flex: 0.5,
		height: 60,
		margin: 8
	},
	text: {
		fontSize: 20
	}
};


const limit = 20;


const availableTags = (tags, selected) =>
	tags.edges.filter (
		({node: tag}) => !selected.edges.find (
			({node}) => node.id === tag.id
		)
	)

class AddTagDialog extends Component {
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
					<Dialog.Actions>
						<DialogDefaultActions
							actions={['dismiss', 'add']}
							onActionPress={(action) => this [action] ()}/>
					</Dialog.Actions>
				</Dialog>
			</View>
		) : null;
	}
}



class ItemPreview extends Component {

	constructor (props) {
		const {name, content, tags} = props.viewer.item;

		super (props);

		this.state = {name, content, tags, addTag: false};
	}

	onTagRemove = (tag) => {
		const {item} = this.props.viewer;

		RelayStore.commitUpdate (
			new UnlinkMutation ({item, tag})
		);
	}

	onTagAdd = (id) => {
		const {item, tags} = this.props.viewer;
		const {node: tag} = tags.edges.find (
			({node}) => node.id === id
		);

		RelayStore.commitUpdate (
			new LinkMutation ({item, tag})
		);
	}

	onTagNavigate = (id) => {
		this.props.router.push ('/tag/' + id);
	}

	onSave = () => {
		const {item} = this.props.viewer;
		const {name, content} = this.state;

		RelayStore.commitUpdate (
			new UpdateItemMutation ({item, name, content})
		);
	}

	render () {
		const {item, tags} = this.props.viewer;
		const {tags: itemTags} = item;

		const {content, name} = this.state;

		const {onTagRemove, onTagAdd, onTagNavigate, onSave} = this;

		return (
            <View>
				<ScrollView
					automaticallyAdjustContentInsets={false}
					scrollEventThrottle={200}>

					<Card
						style={{
							container: styles.container
						}}>

						<Text style={styles.header}>{name}</Text>

						<TextInput
							underlineColorAndroid="transparent"
							style={styles.input}
							placeholder="item name"
							value={name}
							onChangeText={(name) => this.setState ({name})}/>

						<TextInput
							underlineColorAndroid="transparent"
							style={styles.input}
							multiline={true}
							numberOfLines={4}
							placeholder="item content"
							value={content}
							onChangeText={(content) => this.setState ({content})}/>

						{itemTags.edges.map (({node}) =>
							<TagPreview
								onNavigate={onTagNavigate}
								onRemove={onTagRemove}
								tag={node}
								key={node.id}/>
						)}

			            <View
			            	style={styles.controls}>
			                <Button
			                	raised
			                	primary
								onPress={() => this.setState ({
									addTag: true
								})}
								style={buttonStyle}
			                	icon="add"
			                	text="ADD TAG"/>

			                <Button
			                	raised
			                	primary
								onPress={onSave}
								style={buttonStyle}
			                	icon="save"
			                	text="SAVE"/>
			            </View>
					</Card>
				</ScrollView>

				<AddTagDialog
					item={item}
					tags={tags}
					open={this.state.addTag}
					onAdd={onTagAdd}
					onDismiss={() => this.setState ({
						addTag: false
					})}/>

			</View>
		);
	}

}

const ItemView = withRouter ((props) =>
	<ItemPreview {...props}/>
);

export default createRenderer (ItemView, {

	queries: ViewerQuery,

	initialVariables: {
		id: null,
		limit: limit
	},

	fragments: {
		viewer: () => Relay.QL`
			fragment on User {

				item (id: $id) {
					id,
					name,
					content,

					tags (first: $limit){
						edges {
							node {
								id
								${TagPreview.getFragment ('tag')}
							}
						}
					}

				}

				tags (first: 20) {
					edges {
						node {
							id
							name
						}
					}
				}
			}
		`
	}
})