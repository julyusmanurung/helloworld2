import {useState, useEffect} from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    getData();
  }, []);
  const dataList = [];

  const getData = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL);
      const data = await res.json();
      setData(data);
    }
    catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      {error && <div>Failed to load {error.toString()}</div>}
      {
        !data ? <div>Loading...</div>
          : (
            (data?.data ?? []).length === 0 && <p className='text-xl p-8 text-center text-gray-100'>Data Kosong</p>
          )
      }

      <Input onSuccess={getData} />
      {data?.data && data?.data?.map((item, index) => (
        dataList.push(<li className='text-xl text-blue-400' key={index}>{item}</li>)
      ))}
    </div>
  );

  function Input({onSuccess}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const body = {
        text: formData.get("data")
      }
  
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send`, {
          method: 'POST',
          body: JSON.stringify(body)
        });
        const data = await res.json();
        setData(data.message);
        onSuccess();
      }
      catch (error) {
        setError(error);
      }
    }
    return (
      <div>
        <div className='flex items-center justify-center h-48'>
          <form onSubmit={handleSubmit}>
            <div className="group w-72 md:w-80 lg:w-96">
              <label className="inline-block w-full text-xl font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400">Masukkan sesuatu disini...</label>
              <div className="relative flex items-center">
                <input type="text" className="peer relative h-10 w-full rounded-md bg-gray-50 pl-4 pr-20 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:drop-shadow-lg" name="data"/>
                <button className="absolute right-2 h-7 w-16 rounded-md bg-blue-200 text-sm font-semibold text-white transition-all duration-200 ease-in-out group-focus-within:bg-blue-400 group-focus-within:hover:bg-blue-600">Simpan</button>
              </div>
            </div>
          </form>
        </div>
        <div className='flex h-screen'>
          <div className="m-auto">
            <p className='text-xl text-blue-400 font-bold'>Masukan yang tersimpan: </p>
            { dataList }
          </div>
        </div>
        {error && <p className='text-xl text-blue-400'>error: {error.toString()}</p>}
        {data && <p className='text-xl text-blue-400'>success: {data}</p>}
      </div>
    )
  }
}