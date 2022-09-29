import {useState, useEffect} from 'react';
import { isMapIterator } from 'util/types';

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

  const handleDelete =async (id:string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send/${id}`, {
        method: 'DELETE',
      });
      window.location.reload();
      const data = await res.json();
      setData(data.message);
    }
    catch (error) {
      setError(error);
    }
  }

  const handleDone = async (id:string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/send/${id}`, {
        method: 'PUT',
      });
      window.location.reload();
      const data = await res.json();
      setData(data.message);
    }
    catch (error) {
      setError(error);
    } 
  }

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
        dataList.push( 
          <div className='pl-5 flex mb-4 items-center' key={index}>
            <input type="checkbox" defaultChecked={item.done} />
            { item.done == true ? 
                <span id="todolistindex" className='text-xl text-blue-400 pl-2 line-through'>Kegiatan: {item.task}</span> :
                <span id="todolistindex" className='text-xl text-blue-400 pl-2'>Kegiatan: {item.task}</span>
            }
            { item.done == true ? 
                <button onClick={() => handleDone(item.ID)} className="flex-no-shrink p-2 ml-4 mr-2 border-2 text-white rounded border-gray-600 bg-gray-600">Kegiatan Sudah Selesai</button> :
                <button onClick={() => handleDone(item.ID)} className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green-600 border-green-600 hover:bg-green-600 transition-all duration-500 ease-in-out">Sudah Selesai</button>
            }
            <button onClick={() => handleDelete(item.ID)} className="flex-no-shrink p-2 ml-2 border-2 rounded text-red-600 border-red-600 hover:text-white hover:bg-red-600 transition-all duration-500 ease-in-out">Hapus</button>
          </div>)
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
        task: formData.get("data")
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
        <div className='flex items-center justify-center p-10 border-2'>
          <form onSubmit={handleSubmit}>
            <div className="group w-72 md:w-80 lg:w-96">
              <label className="inline-block w-full text-xl font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-400">Masukkan sesuatu apa yang mau kamu lakukan disini...</label>
              <div className="relative flex items-center">
                <input type="text" className="peer relative h-10 w-full rounded-md bg-gray-50 pl-4 pr-20 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:drop-shadow-lg" name="data"/>
                <button className="absolute right-2 h-7 w-16 rounded-md bg-blue-200 text-sm font-semibold text-white transition-all duration-200 ease-in-out group-focus-within:bg-blue-400 group-focus-within:hover:bg-blue-600">Tambah</button>
              </div>
            </div>
          </form>
        </div>
        <div className='flex w-screen p-10'>
          <div className="m-auto">
            <p className='text-xl text-blue-400 font-bold pb-5'>Daftar kegiatan kamu:</p>
            { dataList }
          </div>
        </div>
        {error && <p className='text-xl text-blue-400'>error: {error.toString()}</p>}
        {data && <p className='text-xl text-blue-400'>success: {data}</p>}
      </div>
    )
  }
}