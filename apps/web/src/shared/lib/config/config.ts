export const config =
  process.arch === 'win32'
    ? {
        sourceBooksPath: 'E:\\Audiobooks',
        saveDirectoryPath: 'D:\\Audiobooks_Encoded',
        coversPath: 'C:\\Users\\isden\\Downloads',
      }
    : {
        sourceBooksPath: '/run/media/isden/4TB/Audiobooks',
        saveDirectoryPath: '/tmp',
        coversPath: '/home/isden/Downloads',
      }
