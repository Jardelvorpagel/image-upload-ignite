import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxWidth="900px" maxHeight="600px" width="fit-content">
        <ModalBody padding="0">
          <Image src={imgUrl} maxWidth="900px" maxHeight="600px" />
        </ModalBody>

        <ModalFooter
          background="gray.800"
          justifyContent="flex-start"
          px="10px"
          py="8px"
          borderBottomRadius="6px"
        >
          <Link href={imgUrl} isExternal color="gray.50" fontSize="14px">
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
