import React, { useState } from "react";
import RichTextEditor from "react-rte";

export default function MyStatefulEditor(props) {
  // Initialize the value using RichTextEditor.createValueFromString
  const [value, setValue] = useState(
    RichTextEditor.createValueFromString(props.markup, "html")
  );

  // Define the onChange handler
  const onChange = (newValue) => {
    setValue(newValue);
    if (props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      props.onChange(newValue.toString("html"));
    }
  };

  return <RichTextEditor value={value} onChange={onChange} />;
}
