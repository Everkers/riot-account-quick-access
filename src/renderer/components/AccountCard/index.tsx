import Avvvatars from 'avvvatars-react';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import useGame from 'renderer/hooks/useGame';
import { Game } from 'types/game';
import dayjs from 'dayjs';

const AccountCard = ({ account, game, setAccounts, onUpdate }: IProps) => {
  const gameData = useGame(game);
  const menuOptions = [
    {
      name: 'Use Account',
      onClick: () =>
        window.electron.ipcRenderer.sendMessage('select-account', [account]),
    },
    {
      name: 'Edit',
      onClick: () => onUpdate(account),
    },
    {
      name: 'Copy Credentials',
      onClick: () => {
        navigator.clipboard.writeText(
          `${account.username}:${account.password}`
        );
        toast.success('Copied!');
      },
    },
    {
      name: 'Delete',
      onClick: () => {
        const filteredData = gameData.filter(
          (g: IProps['account']) => g.id !== account.id
        );
        localStorage.setItem(game, JSON.stringify(filteredData));
        setAccounts(filteredData);
        toast.success('Account sucessfully removed!');
      },
    },
  ];

  return (
    <div className="flex  items-center">
      <div className="flex space-x-3 items-center">
        <div>
          {/* eslint-disable-next-line */}
          <Avvvatars size={40} style="shape" value={account.username} />
        </div>
        <div>
          <h1 className="capitalize font-semibold text-white text-lg">
            {account.username}
          </h1>
          <p className="text-[#727272] text-sm">
            Updated on {dayjs(account.updatedAt).format('LLL')}
          </p>
        </div>
      </div>
      <Menu as="div" className="relative ml-auto inline-block text-left">
        <Menu.Button>
          <DotsVerticalIcon className="w-6 text-white" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {menuOptions.map((item) => (
                <Menu.Item>
                  {({ active }) => (
                    // eslint-disable-next-line
                    <span
                      onClick={item.onClick}
                      className={clsx(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 cursor-pointer py-2 text-sm'
                      )}
                    >
                      {item.name}
                    </span>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};
export type Account = {
  username: string;
  password: string;
  id: string;
  updatedAt: string;
};
interface IProps {
  account: Account;
  game: Game;
  onUpdate: (account: Account) => void;
  setAccounts: React.Dispatch<React.SetStateAction<any[]>>;
}
export default AccountCard;
