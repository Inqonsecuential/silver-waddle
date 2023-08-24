import { useState, useEffect } from 'react';
import { GoCopy } from 'react-icons/go';

const generateRandomPassword = (
  length: number,
  options: { numbers: boolean; uppercase: boolean; special: boolean },
): string => {
  let charset = 'abcdefghijklmnopqrstuvwxyz';
  if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.numbers) charset += '0123456789';
  if (options.special) charset += '!@#$%^&*()_-+=';

  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
};

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState<number>(12);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [generatedPasswords, setGeneratedPasswords] = useState<string[]>([]);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [options, setOptions] = useState({
    numbers: true,
    uppercase: true,
    special: true,
  });

  // Load saved passwords and generated passwords from local storage on initial render
  useEffect(() => {
    const savedPasswords = localStorage.getItem('generatedPasswords');
    if (savedPasswords) {
      setGeneratedPasswords(JSON.parse(savedPasswords));
    }
  }, []);

  // Save generated passwords and last 5 passwords to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(
      'generatedPasswords',
      JSON.stringify(generatedPasswords),
    );
  }, [generatedPasswords]);

  // Save generated passwords and last 5 passwords to local storage whenever they change

  useEffect(() => {
    localStorage.setItem(
      'generatedPasswords',
      JSON.stringify(generatedPasswords),
    );
  }, [generatedPasswords]);

  const handleGeneratePassword = () => {
    const newPassword = generateRandomPassword(passwordLength, options);
    setGeneratedPassword(newPassword);
    const updatedGeneratedPasswords = [
      newPassword,
      ...generatedPasswords.slice(0, 4),
    ];
    setGeneratedPasswords(updatedGeneratedPasswords);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setShowCopiedTooltip(true);
    setTimeout(() => {
      setShowCopiedTooltip(false);
    }, 1500); // Hide the tooltip after 1.5 seconds
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-indigo-50'>
      <div className='bg-white p-6 rounded shadow-md'>
        <h1 className='text-3xl font-semibold mb-4 text-indigo-800 font-poppins'>
          Password Generator
        </h1>
        <div className='flex items-center justify-start space-x-3'>
          <label className='block text-indigo-600 font-poppins'>
            Password Length:
          </label>
          <input
            type='text'
            value={passwordLength.toString()}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setPasswordLength(parseInt(value));
            }}
            className='w-16 px-2 py-1 border rounded-md focus:outline-none focus:ring focus:border-indigo-500 font-poppins text-center'
          />
        </div>
        <div className='flex flex-col lg:flex-row items-start justify-start mt-4 lg:space-x-4 font-poppins text-sm'>
          <label>
            <input
              type='checkbox'
              checked={options.numbers}
              onChange={() =>
                setOptions((prevOptions) => ({
                  ...prevOptions,
                  numbers: !prevOptions.numbers,
                }))
              }
              className='mr-1 accent-amber-700'
            />
            Include Numbers
          </label>
          <label>
            <input
              type='checkbox'
              checked={options.uppercase}
              onChange={() =>
                setOptions((prevOptions) => ({
                  ...prevOptions,
                  uppercase: !prevOptions.uppercase,
                }))
              }
              className='mr-1 accent-amber-700'
            />
            Include Uppercase Letters
          </label>
          <label>
            <input
              type='checkbox'
              checked={options.special}
              onChange={() =>
                setOptions((prevOptions) => ({
                  ...prevOptions,
                  special: !prevOptions.special,
                }))
              }
              className='mr-1 accent-amber-700'
            />
            Include Special Characters
          </label>
        </div>
        <button
          onClick={handleGeneratePassword}
          className='mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:bg-indigo-700 font-poppins'
        >
          Generate Password
        </button>
        {generatedPassword && (
          <div className='mt-6'>
            <h2 className='text-lg font-semibold text-indigo-800 font-poppins'>
              Generated Password
            </h2>
            <div className='mt-2 p-3 bg-indigo-100 rounded-lg flex items-center'>
              <p className='text-indigo-800 flex-grow font-poppins'>
                {generatedPassword}
              </p>
              <button
                onClick={handleCopyToClipboard}
                className='px-3 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:bg-indigo-700 relative'
              >
                <GoCopy className='text-lg font-extrabold' />
                {showCopiedTooltip && (
                  <span className='absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white px-3 py-2 rounded text-xs font-poppins'>
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        <div className='mt-6'>
          <h2 className='text-lg font-semibold text-indigo-800 font-poppins'>
            Last 5 Passwords
          </h2>
          <ul className='mt-2 space-y-2'>
            {generatedPasswords.map((password, index) => (
              <li key={index} className='text-indigo-600 font-poppins'>
                {password}
              </li>
            ))}
          </ul>
          {generatedPasswords.length > 5 && (
            <button
              onClick={() =>
                setGeneratedPasswords(generatedPasswords.slice(0, 5))
              }
              className='mt-2 text-indigo-600 hover:underline focus:outline-none'
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
