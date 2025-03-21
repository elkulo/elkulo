import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { generateApiKey } from '../functionals/generateApiKey';
import axios, { isAxiosError } from 'axios';

type postsType = Array<{
  id: number;
  author: {
    handle: string;
    displayName: string;
    url: string;
  };
  context: string;
  createdAt: string;
  uri: string;
}>;

const API_URL = {
  src: import.meta.env.VITE_API_URL || '',
  key: import.meta.env.VITE_API_KEY || '',
  salt: import.meta.env.VITE_API_SALT || '',
};

const bubbleImage = {
  dark: '/assets/images/bubbles/speech-bubble-dark@2x.png',
  light: '/assets/images/bubbles/speech-bubble-light@2x.png',
};

/**
 * mbSubstrFormat
 *
 * @param  {string} text   テキスト.
 * @param  {number} len    文字数.
 * @param  {string} period 末尾の省略文字.
 * @return {string}
 */
const mbSubstrFormat = (text: string, len: number, period: string): string => {
  const processedText = text;
  let txtCount = 0;
  let sliceText = '';
  for (let i = 0; i < processedText.length; i++) {
    const n = encodeURI(processedText.charAt(i));
    txtCount = n.length < 4 ? txtCount + 1 : txtCount + 2;
    if (txtCount > len) {
      return sliceText + period;
    }
    sliceText += processedText.charAt(i);
  }
  return decodeURI(processedText);
};

const BlueskyBubble = () => {
  const { palette } = useTheme();
  const [getPosts, setPosts] = useState<postsType>([]);
  const [getActivePost, setActivePost] = useState(0);
  const [getFailed, setFailed] = useState('connection...');

  // APIから取得.
  useEffect(() => {
    axios
      .get(generateApiKey.url(API_URL.src, API_URL.key, API_URL.salt))
      .then(({ data }: { data: { data: postsType } }) => {
        if (0 < data.data.length) {
          setPosts(data.data);
        } else {
          setPosts([]);
        }
      })
      .catch((e) => {
        if (isAxiosError(e)) {
          console.error(`[${e.code}]${e.message}`);
          setFailed(`Bluesky ${e.message}.`);
        }
        setPosts([]);
      });
  }, []);

  // 表示するバブルの切替.
  const changeActivePost = useCallback(() => {
    if (getPosts && 0 < getPosts?.length) {
      if (getActivePost === getPosts?.length - 1) {
        setActivePost(0);
      } else {
        setActivePost(getActivePost + 1);
      }
    }
  }, [getPosts, getActivePost]);

  // 切替インターバル.
  useEffect(() => {
    const id = setInterval(changeActivePost, 10000);
    return () => clearInterval(id);
  }, [changeActivePost]);

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        position: 'absolute',
        zIndex: '1',
        left: 0,
        bottom: 'calc(100% - 3rem)',
        width: 'calc(600px / 2)',
        height: 'calc(320px / 2)',
        background:
          palette.mode === 'dark'
            ? `url(${bubbleImage.dark})`
            : `url(${bubbleImage.light})`,
        backgroundSize: 'cover',
      }}
    >
      {getPosts && 0 < getPosts?.length ? (
        <>
          <Box
            sx={{
              position: 'absolute',
              zIndex: 9,
              top: 0,
              right: 0,
              textAlign: 'right',
              fontSize: '0.6375rem',
            }}
          >
            <Link
              href={getPosts[0].author.url}
              target="_blank"
              underline="hover"
              sx={{
                boxSizing: 'border-box',
                padding: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              {getPosts[0].author.displayName}({getPosts[0].author.handle})
            </Link>
          </Box>
          {getPosts.map((post, i) => (
            <Box
              key={post.id}
              sx={{
                position: 'absolute',
                zIndex: getActivePost === i ? 99 : i + 1,
                left: '1.25rem',
                top: '2.25rem',
                width: 'calc(100% - 2.5rem)',
                height: '3.25rem',
                overflow: 'hidden',
                borderRadius: '5px',
                background: palette.mode === 'dark' ? '#000' : '#fff',
                opacity: getActivePost === i ? 1 : 0,
                transition: `opacity 800ms ease-in`,
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'block',
                    boxSizing: 'border-box',
                    height: '2.5rem',
                    lineHeight: '1.3',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    overflow: 'hidden',
                  }}
                >
                  {mbSubstrFormat(post.context, 72, '...')}
                </Box>
                <Box
                  sx={{
                    textAlign: 'right',
                    lineHeight: '1.1',
                    fontSize: '0.6375rem',
                    opacity: '0.66',
                  }}
                >
                  at.{post.createdAt}
                </Box>
              </Box>
            </Box>
          ))}
        </>
      ) : (
        <>
          <Box
            sx={{
              position: 'absolute',
              zIndex: 99,
              left: '1.25rem',
              top: '2.125rem',
              width: 'calc(100% - 2.5rem)',
              height: '3.5rem',
              overflow: 'hidden',
              borderRadius: '5px',
              background: palette.mode === 'dark' ? '#000' : '#fff',
              opacity: 1,
              transition: `opacity 800ms ease-in`,
            }}
          >
            <Box>
              <Box
                sx={{
                  display: 'block',
                  boxSizing: 'border-box',
                  height: '2.5rem',
                  lineHeight: '1.4',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  overflow: 'hidden',
                }}
              >
                {getFailed}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default BlueskyBubble;
