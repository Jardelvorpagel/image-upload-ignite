import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

const bytesToMegaBytes = (bytes: number): number =>
  Number((bytes / 1024 ** 2).toFixed(2));

type AddImagePayload = { url: string; title: string; description: string };
const postImage = (payload: AddImagePayload): any =>
  api.post('api/images', payload);

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const imageSupportedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: value =>
          bytesToMegaBytes(value[0].size) < 10 ||
          'O arquivo deve ser menor que 10MB',

        acceptedFormats: value =>
          imageSupportedTypes.includes(value[0].type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(postImage, {
    onSuccess: () => {
      queryClient.invalidateQueries('images');
    },
  });

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'warning',
        });

        return;
      }

      await mutation.mutateAsync({
        url: imageUrl,
        title: data.imageTitle as string,
        description: data.imageDescription as string,
      });

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
      });
    } finally {
      setImageUrl('');
      setLocalImageUrl('');
      reset({
        image: {},
        imageTitle: '',
        imageDescription: '',
      });
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image as any}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.imageTitle as any}
          {...register('imageTitle', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.imageDescription as any}
          {...register('imageDescription', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
