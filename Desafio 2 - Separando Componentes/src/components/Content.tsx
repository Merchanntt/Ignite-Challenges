interface ContentProps {
  title: string
}

export const Content: React.FC<ContentProps> = ({title, children}) => {
  return (
        <div className="container">
            <header>
              <span className="category">Categoria: <span>{title}</span></span>
            </header>

            <main>
              <div className="movies-list">
                {children}
              </div>
            </main>
          </div>
  )
}