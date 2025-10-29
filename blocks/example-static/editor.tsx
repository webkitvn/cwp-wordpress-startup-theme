import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';

interface BlockAttributes {
	message: string;
}

registerBlockType('cwp/example-static', {
	edit: ({ attributes, setAttributes }) => {
		const blockProps = useBlockProps();
		const { message } = attributes as BlockAttributes;

		return (
			<div {...blockProps}>
				<RichText
					tagName="p"
					value={message}
					onChange={(value: string) =>
						setAttributes({ message: value })
					}
					placeholder="Enter message..."
				/>
			</div>
		);
	},
	save: ({ attributes }) => {
		const blockProps = useBlockProps.save();
		const { message } = attributes as BlockAttributes;

		return (
			<div {...blockProps}>
				<p>{message}</p>
			</div>
		);
	},
});
