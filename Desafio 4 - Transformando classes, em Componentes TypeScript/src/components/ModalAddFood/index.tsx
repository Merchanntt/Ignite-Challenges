import { useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';

export interface ResponseFormData {
  id?: number,
  name: string,
  description: string,
  price: string,
  image: string,
  available?: boolean,
}

interface ModalAddFoodProps {
  isOpen: boolean,
  setIsOpen: () => void,
  handleAddFood: (data: ResponseFormData) => Promise<void>,
}

const ModalAddFood = ({isOpen, setIsOpen, handleAddFood}: ModalAddFoodProps) => {
  const formRef = useRef<FormHandles>(null);

  async function handleSubmit(data: ResponseFormData) {
    await handleAddFood(data);
    setIsOpen();
  };

    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Novo Prato</h1>
          <Input name="image" placeholder="Cole o link aqui" />

          <Input name="name" placeholder="Ex: Moda Italiana" />
          <Input name="price" placeholder="Ex: 19.90" />

          <Input name="description" placeholder="Descrição" />
          <button type="submit" data-testid="add-food-button">
            <p className="text">Adicionar Prato</p>
            <div className="icon">
              <FiCheckSquare size={24} />
            </div>
          </button>
        </Form>
      </Modal>
    );
};

export default ModalAddFood;
