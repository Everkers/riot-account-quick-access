import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Input from 'renderer/components/Input';
import { Account } from 'renderer/components/AccountCard';

import useGame from 'renderer/hooks/useGame';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { Game } from 'types/game';

const AccountModal = ({
  open,
  setOpen,
  game,
  setAccounts,
  account,
  setAccountToUpdate,
}: IProps) => {
  const gameData = useGame(game);
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const resetForm = () => {
    setUsername('');
    setPassword('');
  };
  const handleClose = () => {
    setOpen(false);
    resetForm();
    if (account) setAccountToUpdate(null);
  };

  const handleCreate = () => {
    if (username && password) {
      const id = uuidv4();
      const date = new Date();
      const packedData = gameData
        ? [...gameData, { username, password, id, updatedAt: date }]
        : [{ username, password, id, updatedAt: date }];
      localStorage.setItem(game, JSON.stringify(packedData));
      setAccounts(packedData);
      toast.success('Account successfully added!');
      handleClose();
    }
  };

  const handleUpdate = () => {
    if (username && password) {
      const date = new Date();
      const updatedData = gameData.map((g: Account) =>
        g.id === account?.id
          ? { ...account, username, password, updatedAt: date }
          : g
      );
      localStorage.setItem(game, JSON.stringify(updatedData));
      setAccounts(updatedData);
      toast.success('Account successfully updated!');
      handleClose();
    }
  };

  useEffect(() => {
    if (account) {
      setUsername(account.username);
      setPassword(account.password);
    }
  }, [account]);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className=" items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center block p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
            >
              <Dialog.Panel className="relative  mt-40 inline-block  bg-background rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-sm w-full p-6">
                <div className="space-y-5">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Type Username"
                  />
                  <Input
                    icon={
                      !showPassword ? (
                        <EyeIcon
                          onClick={() => setShowPassword(true)}
                          className="w-7 cursor-pointer text-lightText"
                        />
                      ) : (
                        <EyeOffIcon
                          onClick={() => setShowPassword(false)}
                          className="w-7 cursor-pointer text-lightText"
                        />
                      )
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Type Password"
                  />
                </div>
                <div className=" mt-6 grid grid-cols-2 gap-5">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-500 text-sm font-medium text-white hover:bg-gray-600  "
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary  font-medium text-white hover:bg-primary text-sm"
                    onClick={() => (account ? handleUpdate() : handleCreate())}
                  >
                    {account ? 'Update account' : 'Add account'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AccountModal;
interface IProps {
  open: boolean;
  game: Game;
  account: Account | null | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAccounts: React.Dispatch<React.SetStateAction<any[]>>;
  setAccountToUpdate: React.Dispatch<
    React.SetStateAction<Account | null | undefined>
  >;
}
