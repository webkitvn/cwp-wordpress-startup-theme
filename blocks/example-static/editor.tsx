/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';

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

registerBlockType('cwp/example-static', {
	edit: Edit,
	save: Save,
});
