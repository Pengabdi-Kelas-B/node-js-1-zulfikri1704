const fs = require("node:fs");
const readline = require('node:readline');
const path = require('node:path');

// Inisialisasi readline untuk input dari CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Objek utama untuk menyimpan fungsi CLI
const app = {};

// 1. Fungsi membuat folder
app.makeFolder = () => {
  rl.question("Masukkan Nama Folder: ", (folderName) => {
    fs.mkdir(path.join(__dirname, folderName), { recursive: true }, (err) => {
      if (err) throw err;
      console.log(`Folder "${folderName}" berhasil dibuat!`);
      rl.close();
    });
  });
};

// 2. Fungsi membuat file
app.makeFile = () => {
  rl.question("Masukkan nama file (contoh: catatan.txt): ", (fileName) => {
    fs.writeFile(path.join(__dirname, fileName), '', (err) => {
      if (err) throw err;
      console.log(`File "${fileName}" berhasil dibuat!`);
      rl.close();
    });
  });
};

// 3. Fungsi sortir file berdasarkan ekstensi
app.extSorter = () => {
  const sourceFolder = path.join(__dirname, 'unorganize_folder');
  const imageFolder = path.join(__dirname, 'image');
  const textFolder = path.join(__dirname, 'text');

  // Membuat folder jika belum ada
  fs.mkdirSync(imageFolder, { recursive: true });
  fs.mkdirSync(textFolder, { recursive: true });

  fs.readdir(sourceFolder, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const ext = path.extname(file);

      if (ext === '.jpg' || ext === '.png') {
        fs.rename(
          path.join(sourceFolder, file),
          path.join(imageFolder, file),
          (err) => { if (err) throw err; }
        );
      } else if (ext === '.txt') {
        fs.rename(
          path.join(sourceFolder, file),
          path.join(textFolder, file),
          (err) => { if (err) throw err; }
        );
      }
    });

    console.log("File berhasil dipindahkan berdasarkan ekstensi.");
  });
};

// 4. Fungsi menampilkan isi folder
app.readFolder = () => {
  rl.question("Masukkan nama folder yang ingin dibaca: ", (folderName) => {
    const targetFolder = path.join(__dirname, folderName);
    fs.readdir(targetFolder, (err, files) => {
      if (err) throw err;

      const result = files.map((file) => {
        const stats = fs.statSync(path.join(targetFolder, file));
        return {
          nameFile: file,
          ext: path.extname(file),
          jenisFile: path.extname(file) === '.txt' ? 'text' : 'gambar',
          tanggalBuat: stats.birthtime,
          ukuranFile: `${stats.size} byte`,
        };
      });

      console.log(JSON.stringify(result, null, 2));
      rl.close();
    });
  });
};

// 5. Fungsi membaca isi file
app.readFile = () => {
  rl.question("Masukkan nama file yang ingin dibaca: ", (fileName) => {
    const targetFile = path.join(__dirname, fileName);
    fs.readFile(targetFile, 'utf8', (err, data) => {
      if (err) throw err;
      console.log(`Isi file ${fileName}:\n${data}`);
      rl.close();
    });
  });
};

module.exports = app;
