/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import blockMetadata from './block.json';

interface BlockAttributes {
	message: string;
}

interface EditProps {
	attributes: BlockAttributes;
	setAttributes: (attrs: Partial<BlockAttributes>) => void;
}

interface SaveProps {
	attributes: BlockAttributes;
}

const Edit = ({ attributes, setAttributes }: EditProps) => {
	const blockProps = useBlockProps();
	const { message } = attributes as BlockAttributes;

	return (
		<div {...blockProps}>
			<RichText
				tagName="p"
				value={message}
				onChange={(value: string) => setAttributes({ message: value })}
				placeholder="Enter message..."
			/>
		</div>
	);
};

const Save = ({ attributes }: SaveProps) => {
	const blockProps = useBlockProps.save();
	const { message } = attributes as BlockAttributes;

	return (
		<div {...blockProps}>
			<p>{message}</p>
		</div>
	);
};

const blockConfig = {
	...blockMetadata,
	edit: Edit,
	save: Save,
} satisfies BlockConfiguration<BlockAttributes>;

registerBlockType<BlockAttributes>(blockConfig);
