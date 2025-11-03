/**
 * External dependencies
 */
import React from 'react';

/**
 * WordPress dependencies
 */
import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import blockMetadata from './block.json';

interface BlockAttributes {
	title: string;
}

interface EditProps {
	attributes: BlockAttributes;
	setAttributes: (attrs: Partial<BlockAttributes>) => void;
}

const Edit = ({ attributes, setAttributes }: EditProps) => {
	const blockProps = useBlockProps();
	const { title } = attributes as BlockAttributes;

	return (
		<div {...blockProps}>
			<TextControl
				label={__('Title', 'cwp')}
				value={title}
				onChange={(value: string) => setAttributes({ title: value })}
			/>
			<p className="preview">
				{__('Preview:', 'cwp')} {title}
			</p>
		</div>
	);
};

const blockConfig = {
	...blockMetadata,
	edit: Edit,
} satisfies BlockConfiguration<BlockAttributes>;

registerBlockType<BlockAttributes>(blockConfig);
