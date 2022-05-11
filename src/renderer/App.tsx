import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useMemo, useState } from 'react';
import Games from 'renderer/components/Games';
import GAMES from 'constants/games';

import Input from 'renderer/components/Input';
import Button from 'renderer/components/Button';
import AccountCard, { Account } from 'renderer/components/AccountCard';
import AccountModal from 'renderer/components/AccountModal';

import { MinusIcon, UsersIcon } from '@heroicons/react/solid';
import RiotLogo from '../../assets/icons/riot.png';
import useGame from './hooks/useGame';

const Hello = () => {
  const [game, setGame] = useState<number>(0);
  // eslint-disable-next-line
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountToUpdate, setAccounToUpdate] = useState<Account | null>();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const currentGame = useMemo(() => GAMES[game], [game]);
  const gameData = useGame(currentGame.key);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  useEffect(() => {
    // set initial game data
    setAccounts(gameData);
    // eslint-disable-next-line
  }, [currentGame.key]);

  const filteredAccounts = useMemo(
    () =>
      accounts.filter(
        (account) =>
          account.username.toLowerCase().indexOf(searchKeyword.toLowerCase()) >=
          0
      ),
    [searchKeyword, accounts]
  );

  useEffect(() => {
    if (accountToUpdate) setModalOpen(true);
  }, [accountToUpdate]);
  return (
    <div className="p-5 ">
      <div className="flex items-center">
        <div className="flex items-center space-x-5">
          <img src={RiotLogo} className="w-14" alt="img" />
          <h1 className="text-white font-bold text-2xl">Riot Quick Access</h1>
        </div>
        <button
          type="button"
          onClick={() =>
            window.electron.ipcRenderer.sendMessage('minimize', [])
          }
          className="ml-auto"
        >
          <MinusIcon className="w-10  h-10 text-white" />
        </button>
      </div>
      <Games value={game} onChange={(i) => setGame(i)} />
      <div>
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-9">
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Look for an account"
            />
          </div>
          <div className="col-span-3">
            <Button onClick={() => setModalOpen(true)}>Add</Button>
          </div>
        </div>
      </div>
      <AccountModal
        account={accountToUpdate}
        setAccountToUpdate={setAccounToUpdate}
        game={currentGame.key}
        open={modalOpen}
        setAccounts={setAccounts}
        setOpen={setModalOpen}
      />
      <div className="space-y-4 mt-5">
        {!filteredAccounts?.length ? (
          <div className="text-center mt-10">
            <UsersIcon className="mx-auto h-12 w-12 text-white" />
            <h3 className="mt-2 text-sm font-medium text-white">
              {accounts.length
                ? `Cannot find an account with this username`
                : 'No Accounts Found'}
            </h3>
            {!accounts.length && (
              <p className="text-sm text-gray-500">
                Get started by adding a new account
              </p>
            )}
          </div>
        ) : (
          filteredAccounts.map((account) => (
            <AccountCard
              onUpdate={(acc) => setAccounToUpdate(acc)}
              setAccounts={setAccounts}
              game={currentGame.key}
              account={account}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
