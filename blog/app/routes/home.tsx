import { Link } from "react-router";
import { menuItems } from "../content/site";
import { useConsole } from "../components/console/shell";

export function meta() {
  return [
    { title: "Dallas Carraher — Personal System" },
    {
      name: "description",
      content:
        "The personal website of Dallas Carraher. Explore projects, notes, and what’s playing.",
    },
  ];
}
export default function Home() {
  const { selected, select, confirm } = useConsole();
  return (
    <div className="home-menu">
      <h1 className="eyebrow">SELECT A DESTINATION</h1>
      <nav aria-label="Main navigation">
        <ul>
          {menuItems.map((item, index) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className="menu-link"
                aria-current={selected === index ? "true" : undefined}
                onFocus={() => select(index)}
                onMouseEnter={(event) => event.currentTarget.focus({ preventScroll: true })}
                onClick={confirm}
              >
                <span className="selection-arrow" aria-hidden="true">
                  ▸
                </span>
                <span>{item.label}</span>
                <span className="menu-number" aria-hidden="true">
                  {item.number}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="menu-description">
        <span className="tiny-cross" aria-hidden="true">
          +
        </span>
        {menuItems[selected].description}
      </div>
    </div>
  );
}
