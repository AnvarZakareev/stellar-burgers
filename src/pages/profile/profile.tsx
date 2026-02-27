import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store/store';
import { userSlice } from '../../services/user/slice';
import { updateUser } from '../../services/user/actions';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSlice.selectors.selectUser);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user?.name, user?.email]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    !!formValue.password;

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();

      if (!isFormChanged) return;

      try {
        const updateData: any = {};

        if (formValue.name !== (user?.name || '')) {
          updateData.name = formValue.name;
        }
        if (formValue.email !== (user?.email || '')) {
          updateData.email = formValue.email;
        }
        if (formValue.password) {
          updateData.password = formValue.password;
        }

        await dispatch(updateUser(updateData)).unwrap();
        setFormValue((prev) => ({ ...prev, password: '' }));
      } catch (error) {
        console.error('Ошибка обновления профиля:', error);
      }
    },
    [dispatch, formValue, user, isFormChanged]
  );

  const handleCancel = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setFormValue({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
      });
    },
    [user]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValue((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
      }));
    },
    []
  );

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
