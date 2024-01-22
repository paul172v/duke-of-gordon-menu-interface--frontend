interface MessageBoxProps {
  messageBoxPropsHandler: (
    heading: string,
    message: string,
    label: string,
    isError: boolean,
    destination: string
  ) => void;
}

export default MessageBoxProps;
