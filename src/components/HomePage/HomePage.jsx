import { Link } from "react-router-dom";
import "../HomePage/HomePage.css";

function Home() {
  return (
    <div className="home-page">
      <h1>
      Kitaplarla Dolu Bir Dünyaya Hoşgeldiniz! <span></span>
      </h1>

      <p>
      Okuma alışkanlığınızı bir üst seviyeye çıkarın! Kategoriler arasında gezinin, yazarları keşfedin ve en yeni yayınevlerine göz atın.
      Aşağıdaki bölümlerden ilginizi çeken sayfaya göz atabilirsiniz.
      </p>

      <div className="home-container">
        <Link to="/book">
          <button>📚 Kitap Sayfası</button>
        </Link>
        <Link to="/publisher">
          <button>📖 Yayımevi Sayfası</button>
        </Link>
        <Link to="/category">
          <button>🏷️ Kategori Sayfası</button>
        </Link>
        <Link to="/author">
          <button>✍️ Yazar Sayfası</button>
        </Link>
        <Link to="/borrow">
          <button>📥 Kitap Alma Sayfası</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
