import { Link } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { Facebook, Instagram, Send, Youtube, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-primary text-white px-3 py-2 rounded-lg font-bold text-xl">
                OB
              </div>
              <div className="ml-3">
                <h4 className="font-bold text-xl">OptomBazar</h4>
                <p className="text-sm text-gray-400">Оптовый рынок Узбекистана</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              {t("aboutDesc")}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-telegram"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-youtube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-bold mb-4">{t("categories")}</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/catalog?category=polietilen-paketlar">
                  <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-footer-bags">
                    Polietilen paketlar
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=bir-martalik-idishlar">
                  <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-footer-dishes">
                    Bir martalik idishlar
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=uy-buyumlari">
                  <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-footer-home">
                    Uy buyumlari
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=elektronika">
                  <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-footer-electronics">
                    Elektronika
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=kiyim-kechak">
                  <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-footer-clothing">
                    Kiyim-kechak
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h5 className="font-bold mb-4">{t("forCustomers")}</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/delivery">
                  <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-delivery">
                    {t("delivery")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/payment">
                  <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-payment">
                    {t("payment")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-returns">
                    {t("returns")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/help">
                  <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-help">
                    {t("help")}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-footer-blog">
                    AI {t("blog")}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-bold mb-4">{t("contact")}</h5>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {t("phone")}
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {t("email")}
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Toshkent sh., O'zbekiston
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                24/7 ochiq
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex md:justify-between flex-col md:flex-row items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">{t("allRights")}</p>
            <div className="flex space-x-4 text-sm text-gray-400">
              <Link href="/privacy">
                <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-privacy">
                  {t("privacyPolicy")}
                </span>
              </Link>
              <Link href="/terms">
                <span className="hover:text-white transition-colors cursor-pointer" data-testid="link-terms">
                  {t("termsOfUse")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
