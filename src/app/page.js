"use client";

import Image from "next/image";
import { useState } from "react";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export default function Home() {
  const [generation, setgeneration] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setgeneration(null)
    setLoading(true);



    const response = await fetch("/api/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
        image: e.target.image.value,
      }),
    });

    if (!response.ok) {
      console.log(response);
      const errorMessage = await response.text();
      setError(errorMessage || "An error occurred.");
      setLoading(false);
      return;
    }

    try {
      console.log(response);
      let generation = await response.json();
      if (!generation) {
        setError("Empty response received.");
        setLoading(false);
        return;
      }

      while (
        generation.status !== "succeeded" &&
        generation.status !== "failed"
      ) {
        await sleep(2000);
        const statusResponse = await fetch("/api/generation/" + generation.id);
        generation = await statusResponse.json();
        if (!generation) {
          setError("Empty response received.");
          setLoading(false);
          return;
        }
        if (generation.status === "succeeded") {
          setLoading(false);
        }
        setgeneration(generation);
      }
    } catch (error) {
      setError("Error parsing response.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 flex flex-col md:flex-row items-center justify-center pt-10">
      <div>
        <header className="text-center py-10">
          <h1 className="text-5xl font-roboto font-bold text-white">
            Imagineer
          </h1>
        </header>

        <form
            onSubmit={handleSubmit}
            className="mb-10 flex flex-col space-y-5 w-full md:min-w-[500px]"
        >
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
            <input
                className="py-2 px-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full w-full"
                type="text"
                name="prompt"
                placeholder="Enter a prompt..."
            />
            {Loading === true ? (
                <div role="status">
                  <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
            ) : (
                <button
                    type="submit"
                    className="py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full sm:w-auto"
                >
                  Go!
                </button>
            )}
          </div>
          <input
              className="py-2 px-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full w-full"
              type="text"
              name="image"
              placeholder="Enter Image URL to edit (optionnal)"
          />
          {/*<div className="flex flex-row items-center ">*/}
          {/*  <input*/}
          {/*      className="hidden"*/}
          {/*      type="file"*/}
          {/*      name="image"*/}
          {/*      id="uploadInput"*/}
          {/*      onChange={(event) => {*/}
          {/*        const file = event.target.files[0];*/}
          {/*        setImage(file ? file : null);*/}
          {/*      }}*/}
          {/*      accept="image/*"*/}
          {/*      disabled // Add the disabled attribute*/}
          {/*      style={{*/}
          {/*        opacity: '0.5',*/}
          {/*        cursor: 'not-allowed'*/}
          {/*      }} */}
          {/*  />*/}

          {/*  <label*/}
          {/*      htmlFor="uploadInput"*/}
          {/*      className="py-2 px-4 border border-white-600 text-white-600 hover:border-gray-200 hover:text-gray-200 rounded-lg cursor-pointer"*/}
          {/*  >*/}
          {/*    Upload an image*/}
          {/*  </label>*/}
          {/*  {image && (*/}
          {/*      <div className="pl-5 rounded text-center">{image.name}</div>*/}
          {/*  )}*/}
          {/*</div>*/}
          {error && (
              <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-1/2 mx-auto mt-4"
                  role="alert"
              >
                <strong className="font-bold">Oh no!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
          )}
          <div className="w-full md:w-[500px] h-full md:h-[500px] rounded-lg overflow-hidden">
            {generation &&
                generation.status === "succeeded" &&
                generation.output && (
                    <Image
                        src={generation.output[generation.output.length - 1]}
                        alt="output"
                        layout="responsive"
                        width={500}
                        height={500}
                        objectFit="cover"
                    />
                )}
            {Loading === true && (
                <div
                    role="status"
                    className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse md:flex md:items-center"
                >
                  <div
                      className="flex items-center justify-center w-full md:w-[500px] h-full md:h-[500px] bg-gray-300 rounded bg-gray-700">
                    <svg
                        className="w-10 h-10 text-gray-200 dark:text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 18"
                    >
                      <path
                          d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                    </svg>
                  </div>
                  <span className="sr-only">Loading...</span>
                </div>
            )}
          </div>
        </form>
        <div></div>
      </div>
    </div>
  );
}
