import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

interface BlockAttributes {
	title: string;
}

registerBlockType('cwp/example-dynamic', {
	edit: ({ attributes, setAttributes }) => {
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
	},
});
